#!/bin/bash

echo "🚀 Déploiement pour serveur Node.js Infomaniak"

# Nettoyer les anciens builds
rm -rf build/
rm -rf deploy/

# Construire le projet React localement
echo "📦 Construction du projet React..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction"
    exit 1
fi

# Créer le dossier de déploiement
mkdir -p deploy

# Copier uniquement les fichiers nécessaires pour la production
echo "📁 Préparation des fichiers de déploiement..."
cp -r build/ deploy/
cp server.js deploy/

# Créer un package.json minimal pour la production
cat > deploy/package.json << 'EOF'
{
  "name": "lecran-total-production",
  "version": "1.0.0",
  "description": "Application web de découverte cinématographique - Production",
  "main": "server.js",
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node server.js"
  }
}
EOF

# Créer l'archive de déploiement
echo "🗜️ Création de l'archive..."
cd deploy
tar -czf ../deploy-nodejs.tar.gz .
cd ..

echo "✅ Déploiement prêt : deploy-nodejs.tar.gz"
echo "📋 Instructions pour Infomaniak :"
echo "   1. Uploadez deploy-nodejs.tar.gz sur votre serveur"
echo "   2. Extrayez l'archive"
echo "   3. Commande de construction : npm install"
echo "   4. Commande d'exécution : npm start"
echo ""
echo "🎯 Commandes exactes pour Infomaniak :"
echo "   - Commande de construction : npm install"
echo "   - Commande d'exécution : npm start"