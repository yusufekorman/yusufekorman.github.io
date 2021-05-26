const express = require('express')
const app = express()
const port = 80
const firebase = require('firebase');
const version = require('./src/version.json');

var firebaseConfig = {
    apiKey: "AIzaSyAYi2pxoMUoUhHLWgdh44ZW-PIt-RXBaLM",
    authDomain: "blog-database-4835d.firebaseapp.com",
    projectId: "blog-database-4835d",
    storageBucket: "blog-database-4835d.appspot.com",
    messagingSenderId: "989967104125",
    appId: "1:989967104125:web:a903e2beccc978711fd914"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

let posts = [];
let users = [];
let apiKeys = [];

firebase.database().ref('posts/').on("value", snapshot => {
    var data = Object.values(snapshot.val());
    data.forEach(post => {
        posts.push(post);
    })
})

firebase.database().ref('users/').on("value", snapshot => {
    var data = Object.values(snapshot.val());
    data.forEach(user => {
        users.push(user);
    })
});

firebase.database().ref('apiKeys/').on("value", snapshot => {
    var data = Object.values(snapshot.val());
    data.forEach(key => {
        apiKeys.push(key);
    })
});

app.get('/api/post/:id', (req, res) => {
    try {
        const post = posts.find(post => post.slug === String(req.params.id));
        res.json(post);

        notification(req);
    } catch (error) {
        res.json({
            message: "Post not found.",
            status: 404
        });
    }
})

app.get('/api/user/:id', (req, res) => {
    try {
        res.json({
            accauntType: findUser(req.params.id, 'accauntType'),
            id: findUser(req.params.id, 'id'),
            isMod: findUser(req.params.id, 'isMod'),
            name: findUser(req.params.id, 'name'),
            username: findUser(req.params.id, 'username')
        });

        notification(req);
    } catch (error) {
        res.json({
            message: "User not found.",
            status: 404
        });
    }
})

app.get('/api/version/:apiKey', (req, res) => {
    findApiKey(req.params.apiKey, res, (data) => {
        if (data === true) {
            res.json(version);

            notification(req);
        } else {
            res.json({
                message: "Unauthorized Entry",
                status: NaN
            });
        }
    })
})

const findUser = (id, key) => {
    return users.find(user => user.username === id)[key];
}

const findApiKey = (key, res, fn) => {

    let target = false;

    if (key === "asd") {
        res.json({
            message: "Unauthorized Entry",
            status: NaN
        });
    } else {
        apiKeys.forEach(_key => {
            if (_key === key) {
                target = true;
            }
        });

        fn(target);

        firebase.database().ref('apiKeys/' + key).remove();
    }
}

const notification = (request) => {
    console.log(request.path + " GET isteği geldi.");
}

app.listen(port, () => {
    console.log(`Application Started.`);
    console.log(`Port ${port}`);
})