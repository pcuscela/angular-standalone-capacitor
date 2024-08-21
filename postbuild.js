console.log('------ INIZIO POSTBUILD ------- ');
const fs = require('fs');
const environmentJson = require('./src/assets/environment/prod/environment.json');
const angularJson = require('./angular.json');
const project = Object.keys(angularJson.projects)[0];
const artifactsFolder =
	angularJson.projects[project].architect.build.configurations.production.outputPath ||
	angularJson.projects[project].architect.build.options.outputPath;
const appVersion = environmentJson.appVersion;
const buildNumber = environmentJson.buildNumber;
const progettoSentry = environmentJson.sentryNomeProgetto;

if (appVersion === null || buildNumber === null) {
	console.error('Errore: appVersion o buildNumber non trovati nel file environment.prod.json');
	return;
}

if (progettoSentry === null) {
	console.error('Errore: sentryNomeProgetto non trovato nel file environment.prod.json');
	return;
}

// scrivo le versioni nella configurazione del progetto per ios
fs.readFile('ios/App/App.xcodeproj/project.pbxproj', 'utf8', (err, data) => {
	var result = data
		.replace(/MARKETING_VERSION = (.*)/g, 'MARKETING_VERSION = ' + appVersion + ';')
		.replace(/CURRENT_PROJECT_VERSION = (.*)/g, 'CURRENT_PROJECT_VERSION = ' + buildNumber + ';');
	fs.writeFile('ios/App/App.xcodeproj/project.pbxproj', result, 'utf8', (err) => {
		if (err) return console.log(err);
	});
});

// scrivo le versioni nella configurazione del progetto per android
fs.readFile('android/app/build.gradle', 'utf8', (err, data) => {
	var result = data
		.replace(/versionName '(.*)'/g, "versionName '" + appVersion + "'")
		.replace(/versionCode (.*)/g, 'versionCode ' + buildNumber);
	fs.writeFile('android/app/build.gradle', result, 'utf8', (err) => {
		if (err) return console.log(err);
	});
});

if (!angularJson.projects[project].architect.build.configurations.production.sourceMap) {
	console.error(
		'Errore: sourceMap non abilitato nel file angular.json',
		'Abilitare sourceMap in app.architect.build.configurations.production.sourceMap = true e riprovare',
	);
	rl.close();
	return;
}

console.log('Carico i sourcemaps su sentry....');
const cmd = `npx sentry-cli sourcemaps upload --org kedos --project ${progettoSentry} --release "RELEASE_${buildNumber}" ./${artifactsFolder}/browser`;
console.log('Eseguo il comando per caricare i sourcemaps su Sentry: ' + cmd);
const execSync = require('child_process').execSync;
execSync(cmd, { stdio: 'inherit' });

console.log('------ FINE POSTBUILD ------- ');
