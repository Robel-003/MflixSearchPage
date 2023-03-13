import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from 'express';
import cors from 'cors';

dotenv.config();
console.log(process.env);

const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;

const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(cors());

app.get('/findOne', async (req,res) => {
    try {
        //const dataSource = client.dataSource('Cluster0');
        const database = client.db('sample_mflix');
        const collection = database.collection('movies');
        const query = {};
        if (req.query.title) {
            query.title = req.query.title;
        }  
        if (req.query.rated) {
            query.rated = req.query.rated;
        }  
        if (req.query.genres) {
            query.genres = req.query.genres;
        }  
        if (req.query.cast) {
            query.cast = req.query.cast;
        } 
        if (req.query.directors) {
            query.directors = req.query.directors;
        } 
        const movieListing = await collection.findOne(query);
        console.log(movieListing);
        res.type('json');
        res.status(200);
        res.json({
            /* return JSON with below proper ties
            * title, rated, directors, genres, plot, released, tomatoes, cast */
            title: movieListing.title,
            rated: movieListing.rated,
            directors: movieListing.directors,
            genres: movieListing.genres,
            plot: movieListing.plot,
            released: movieListing.released,
            cast: movieListing.cast,
            poster: movieListing.poster
        });
    } catch (error) {
      console.log(error)  
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    } 
});

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
        console.log('Express started');
});

