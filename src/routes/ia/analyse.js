module.exports = (app, openai) => {
  
    // Route POST pour l'évaluation de code
    app.post("/api/evaluate-code", async (req, res) => {
      const { code, language } = req.body;

      // Validation des entrées
      if (!code || !language) {
        return res.status(400).json({ error: "Le code et le langage sont requis" });
      }

      if (code.length > 10000) {
        return res.status(400).json({ error: "Le code ne doit pas dépasser 10000 caractères" });
      }

      console.log("OpenAI instance:", openai ? "Initialisée" : "Non initialisée");
      console.log("Code reçu:", code.substring(0, 100) + "...");
      console.log("Langage:", language);

      const prompt = `
Tu es un expert en évaluation de code ${language}. Analyse le code suivant et fournis un feedback structuré en JSON avec les critères suivants :

{
  "readability": {
    "score": "note sur 10",
    "comments": "points forts et faibles de la lisibilité"
  },
  "complexity": {
    "score": "note sur 10",
    "analysis": "analyse de la complexité algorithmique"
  },
  "bestPractices": {
    "score": "note sur 10",
    "compliance": "respect des bonnes pratiques"
  },
  "improvements": [
    "liste des pistes d'amélioration"
  ]
}

Code à évaluer :
\`\`\`${language}
${code}
\`\`\`
`;

      try {
        console.log("Tentative d'appel à l'API OpenAI...");
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        });
        console.log("Réponse reçue de l'API OpenAI");

        const feedback = response.choices[0].message.content;
        
        // Tentative de parsing du JSON
        try {
          const parsedFeedback = JSON.parse(feedback);
          res.json(parsedFeedback);
        } catch (parseError) {
          console.error("Erreur de parsing JSON:", parseError);
          // Si le parsing échoue, on renvoie le feedback brut
          res.json({ feedback });
        }
      } catch (err) {
        console.error("Erreur GPT détaillée:", err);
        if (err.response?.status === 429) {
          if (err.code === 'insufficient_quota') {
            res.status(429).json({ 
              error: "Quota API OpenAI insuffisant", 
              details: "Veuillez vérifier votre quota et votre solde sur le portail OpenAI" 
            });
          } else {
            res.status(429).json({ error: "Limite de requêtes atteinte" });
          }
        } else if (err.response?.status === 401) {
          res.status(401).json({ error: "Clé API invalide" });
        } else {
          res.status(500).json({ error: "Erreur lors de l'analyse du code", details: err.message });
        }
      }
    });

};

