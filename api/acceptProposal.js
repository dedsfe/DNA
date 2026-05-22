export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { company, contact, whatsapp, selectedServices, financials } = req.body;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in Vercel.");
      return res.status(500).json({ error: "Server Configuration Error" });
    }

    // --- 1. Encontrar ou Criar Cliente ---
    const companyName = (company || "Empresa Desconhecida").trim();
    let clientId = null;

    // Processar campos financeiros
    let dueDay = 5;
    if (financials && financials.due_date) {
       // extrair o dia da data (ex: '2026-05-25' -> 25)
       const parts = financials.due_date.split('-');
       if (parts.length === 3) dueDay = parseInt(parts[2], 10);
    }
    const financialFields = financials ? {
      setup_fee: financials.setup_fee || 0,
      mrr: financials.mrr || 0,
      late_fee_percentage: financials.late_fee_percentage || 2,
      late_fee_interest_per_month: financials.late_fee_interest_per_month || 1,
      due_day: dueDay
    } : {};

    // A) Buscar todos os clientes para fazer um match inteligente (agência tem poucos clientes, é performático)
    const searchRes = await fetch(`${supabaseUrl}/rest/v1/clients?select=id,name`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (searchRes.ok) {
      const allClients = await searchRes.json();
      const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedNew = normalize(companyName);
      
      // Tenta achar um cliente onde o nome existente contenha o novo, ou o novo contenha o existente
      // Ex: "Decorali Planejados" contém "Decorali"
      const match = allClients.find(c => {
        const normExisting = normalize(c.name);
        return normExisting.includes(normalizedNew) || normalizedNew.includes(normExisting);
      });

      if (match) {
        clientId = match.id;
      }
    }

    if (clientId) {
      // B) Atualizar o cliente existente para 'active' e setar financeiro
      await fetch(`${supabaseUrl}/rest/v1/clients?id=eq.${clientId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'active', contact_phone: whatsapp || undefined, ...financialFields })
      });
    } else {
      // C) Criar um novo cliente se não existir
      const clientPayload = {
        name: companyName,
        status: "active",
        contact_phone: whatsapp || "",
        since: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        ...financialFields
      };

      const createRes = await fetch(`${supabaseUrl}/rest/v1/clients`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(clientPayload)
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        throw new Error(`Failed to create client: ${err}`);
      }

      const clientData = await createRes.json();
      clientId = clientData[0].id;
    }

    // --- 2. Criar Tarefas de Onboarding Padrão ---
    const defaultTasks = [
      {
        client_id: clientId,
        title: "✅ Criar Pasta do Cliente no Drive e Organizar Assets",
        description: `Cliente: ${company}\nContato: ${contact}\n\nReunir logotipo, brandbook e acessos.`,
        priority: "high",
        status: "pending"
      },
      {
        client_id: clientId,
        title: "💬 Configurar Grupo de WhatsApp com o Cliente",
        description: `Adicionar o contato principal: ${contact} (${whatsapp || 'Sem número'})`,
        priority: "high",
        status: "pending"
      },
      {
        client_id: clientId,
        title: "🗓️ Agendar Reunião de Kickoff",
        description: "Marcar a primeira reunião oficial para alinhamento de expectativas e cronograma.",
        priority: "medium",
        status: "pending"
      }
    ];

    // --- 3. Criar Tarefas dos Serviços Selecionados ---
    if (Array.isArray(selectedServices)) {
      selectedServices.forEach(service => {
        defaultTasks.push({
          client_id: clientId,
          title: `Executar: ${service}`,
          description: `Serviço selecionado na proposta aprovada.`,
          priority: "medium",
          status: "pending"
        });
      });
    }

    // Fazer insert múltiplo das tarefas
    const tasksRes = await fetch(`${supabaseUrl}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(defaultTasks)
    });

    if (!tasksRes.ok) {
      const err = await tasksRes.text();
      console.error("Failed to create tasks:", err);
      // Don't throw, client was already created
    }

    return res.status(200).json({ success: true, clientId });

  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
