const neo4j = require('neo4j-driver');

class driver {
  constructor(username, password, url) {
    this.driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'));
    this.session = this.driver();
  }
}

module.exports = driver;


service (name) {
	session.run(`CREATE(n:Service {name: "${name}"}) RETURN n`)
		.then((response) => console.log("response"))
		.catch((error) => {
			console.log('there was an error ', error)
		})
}

