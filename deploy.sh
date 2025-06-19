#!/bin/bash

echo "🚀 Déploiement pour serveur Node.js"

# Nettoyer les anciens builds
rm -rf build/
rm -rf deploy/

# Construire le projet React
echo "📦 Construction du projet React..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction"
    exit 1
fi

# Créer le dossier de déploiement
mkdir -p deploy

# Copier les fichiers nécessaires
echo "📁 Préparation des fichiers de déploiement..."
cp -r build/ deploy/
cp server.js deploy/
cp package.json deploy/
cp package-lock.json deploy/ 2>/dev/null || true

# Créer l'archive de déploiement
echo "🗜️ Création de l'archive..."
cd deploy
tar -czf ../deploy-nodejs.tar.gz .
cd ..

echo "✅ Déploiement prêt : deploy-nodejs.tar.gz"
echo "📋 Instructions :"
echo "   1. Uploadez deploy-nodejs.tar.gz sur votre serveur Infomaniak"
echo "   2. Extrayez l'archive"
echo "   3. Exécutez : npm install --production"
echo "   4. Démarrez avec : npm start"