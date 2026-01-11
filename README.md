
### Full stack Twitter clone web app
<hr>

#### Installation - CLI
<hr>

1. Clone this repository: ``git clone https://github.com/AceGjorgjievski/Twitter-Clone.git``
2. Navigate to the folder via CLI ``cd Twitter-Clone``
3. Open it with your editor (VSCode users: ``code .``)
4. Open your database management tool (pgadmin, mysql workbench) and create a database
5. Navigate to the backend folder and create ``.env`` file as specified in the
   ``.env_backend_sample.txt`` file
6. Navigate to the frontend folder and create ``.env`` file as specified in the
   ``.env_frontend_sample.txt`` file
6. If you have completed the steps above, open terminal and navigate to the frontend root folder ``cd: twitter-frontend``
7. Write: ``npm install``
8. Now navigate to the backend root folder ``cd: twitter-backend``
9. Write: ``npm install``
10. Now again write: ``npx prisma migrate dev`` & after this line write: ``npx prisma generate``
11. If everything is installed properly (frontend & backend), run the apps [frontend: ``npm run dev`` & backend: ``npm run start:dev``]
12. In your browser, open [localhost:3000](http://localhost:3000) and test the app.
13. Register 2 or 3 users & test the app.

***Note:***
1. In new terminal you can see the database by running ``npx prisma studio`` and navigate to [locahost:5555](http://localhost:5555)



#### Technologies & Architecture
<hr>

- Frontend framework: **Next.js + MUI**
- Backend framework: **Nest.js**
- Authentication: **JWTs**
- ORM: **Prisma**
- Database: **PostgreSQL**

**Frontend:** Minimal & Modular architecture <br>
**Backend:** Layerd architecture

#### Functionalities implemented
- User registration and login
- Creating a post (tweet)
- Feed displaying posts
- Like functionality
- Retweet functionality
- User profile page

Bonus:
- Display of own and other user’s posts
- Edit tweet
- Delete tweet
- Clicking on tweet (details page tweet)
- Infinite scroll
- Image upload


#### Preview [video]
<hr>

[Link to the video](https://www.youtube.com/watch?v=n0eSkkp___M)




