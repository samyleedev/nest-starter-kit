

# Database configuration (for MacOS, with [Homebrew](https://brew.sh/))
1. Into the terminal, Install Postgresql : `brew install postgresql`
2. Start Postgresql services : `brew services start postgresql`
3. Enter inside Postgresql interface: `psql postgres`
4. To verify the current user: `SELECT current_user;`.  
Usually default user is `postgres` without any password.
5. If you want to create an other user: `CREATE USER new_user WITH PASSWORD 'new_password';` or modify the password of an existing one : `ALTER USER existing_user WITH PASSWORD 'new_password';`
6. When you're connected with the user of your choice, create the database: `CREATE DATABASE database_name;`
7. In your nest-starter-kit root folder, duplicate `.env.exemple`, rename it to `.env`, and add the right values to the right keys ! (especially `DATABASE_USERNAME` & `DATABASE_PASSWORD`)
5. That's it, now you're ready to create the app of your dream ! ☕❤️   
We recommand using [Postico](https://eggerapps.at/postico2/) to visualize your database 