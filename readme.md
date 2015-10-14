# Linkage

Simple link tracking tool built with Express.js and Sequelize.


Install `npm install`

Start server `npm start`

Run tests `npm test`

###Creating new links

####Post via JSON

	curl -X "POST" "http://localhost:3000/create" \
	  -H "Content-Type: application/json" \
	  -d "{\"url\":\"http://www.yahoo.com\"}"

####Post via Form

	curl -X "POST" "http://localhost:3000/create" \
	  -H "Content-Type: application/x-www-form-urlencoded" \
	  --data-urlencode "url=http://www.google.com"