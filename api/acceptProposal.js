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
    const { company, contact, whatsapp, selectedServices } = req.body;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in Vercel.");
      return res.status(500).json({ error: "Server Configuration Error" });
    }

    // --- 1. Criar Cliente ---
    const clientPayload = {
      name: company || "Empresa Desconhecida",
      status: "active",
      contact_phone: whatsapp || "",
      since: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    const clientRes = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(clientPayload)
    });

    if (!clientRes.ok) {
      const err = await clientRes.text();
      throw new Error(`Failed to create client: ${err}`);
    }

    const clientData = await clientRes.json();
    const clientId = clientData[0].id;

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
