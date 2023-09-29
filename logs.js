const process = require("node:process")
const fs = require('fs');
const path = require('path')
const readline = require('readline')
const Discord = require("discord.js")

module.exports = async bot => {
    
    // Fonction pour obtenir un horodatage au format 'YYYY-MM-DD_HH-mm-ss'
    function getTimestamp() {
        const now = new Date();
        return `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
    }

    // Chemin du dossier "logs"
    const logsFolderPath = path.join(__dirname, 'logs'); // Utilisez le chemin approprié ici

    // Créer le dossier "logs" s'il n'existe pas
    if (!fs.existsSync(logsFolderPath)) {
        fs.mkdirSync(logsFolderPath);
    }

    // Nom du fichier de log avec horodatage
    const logFile = path.join(logsFolderPath, `console_${getTimestamp()}.log`);

    // Rediriger la sortie de la console vers un fichier de log
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    console.log = function(message) {
        const logMessage = `[${new Date().toLocaleString()}] ${message}\n`;
        process.stdout.write(logMessage); // Afficher le message dans la console
        logStream.write(logMessage); // Écrire le message dans le fichier de log
    };

    // Capturer l'événement 'SIGINT' du terminal pour un arrêt manuel
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', async () => {
        const em = new Discord.EmbedBuilder()
        .setTitle("Arrêt du bot")
        .setDescription(`Le bot a été arrété manuellement!`)
        .setColor("#ff0000")

        await bot.web.send({embeds: [em]})

        console.log('Arrêt manuel détecté. Fermeture du fichier de log...');
        logStream.end(() => {
            console.log('Fichier de log fermé.');
            process.exit(0);
        });
    });

    // Capturer l'événement 'exit' du processus
    process.on('exit', async (code) => {
        const em = new Discord.EmbedBuilder()
        .setTitle("Arrêt du bot")
        .setDescription(`Le bot a été arrété!`)
        .setColor("#ff0000")

        await bot.web.send({embeds: [em]})
        // Fermer le fichier de log
        logStream.end(() => {
            console.log(`Fichier de log fermé. Code de sortie : ${code}`);
        });
    });

    console.log('[log] Fichier de log crée avec succés!');

    // Supprimer les fichiers de journalisation après 30 jours
    const daysToKeepLogs = 30;
    const currentTime = new Date().getTime();
    fs.readdirSync(logsFolderPath).forEach(file => {
        const filePath = path.join(logsFolderPath, file);
        const fileStat = fs.statSync(filePath);
        const fileAge = (currentTime - fileStat.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (fileAge > daysToKeepLogs) {
            fs.unlinkSync(filePath);
            console.log(`Fichier de log ${file} supprimé.`);
        }
    });
}