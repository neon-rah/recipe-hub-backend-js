Merci d’avoir envoyé les mappers (`NotificationMapper.java`, `RecipeMapper.java`, `UserMapper.java`). Ces mappers Spring Boot (basés sur MapStruct) définissent comment transformer les entités en DTOs et vice-versa. On va les adapter en JavaScript pour notre backend Node.js avec Sequelize, en intégrant cette logique dans les services existants ou en créant un dossier `mappers/` dédié si tu préfères une séparation stricte. Je vais te proposer une approche pragmatique qui reste fidèle à ton design Spring Boot tout en s’adaptant à l’environnement JavaScript.

---

### Approche choisie
- **Intégration dans les services** : Dans les services que j’ai déjà fournis (ex. `authService.js`, `recipeService.js`), j’ai inclus des fonctions `toDTO` qui mappent les entités Sequelize en objets DTO. Cela fonctionne bien pour une première version et évite de multiplier les fichiers.
- **Ajout des mappers** : Puisque tu as envoyé les mappers, je vais les transformer en fichiers JavaScript dans un dossier `mappers/` pour refléter ta structure Spring Boot. On appellera ces mappers depuis les services pour garder une séparation claire entre la logique métier et la transformation des données.
- **Pourquoi cette approche ?** : En JavaScript, on n’a pas besoin de MapStruct (qui génère du code à la compilation). On peut écrire des fonctions manuelles simples et réutilisables, ce qui est plus léger et adapté à Node.js.

---

### Étape 1 : Création des mappers en JavaScript
Crée un dossier `mappers/` dans ton projet et ajoute les fichiers suivants :

#### 1. `mappers/notificationMapper.js`
Ce mapper transforme `Notification` en `NotificationDTO` et vice-versa.

```javascript
const notificationMapper = {
  async toDTO(notification) {
    const sender = await notification.getSender(); // Charge l'utilisateur sender via Sequelize
    return {
      idNotif: notification.idNotif,
      idUser: notification.user_id,
      senderId: notification.sender_id,
      senderLastName: sender?.lastName || null,
      senderFirstName: sender?.firstName || null,
      senderEmail: sender?.email || null,
      senderProfilePic: sender?.profilePic || null,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
      read: notification.read,
      relatedEntityId: notification.relatedEntityId,
      entityType: notification.entityType,
    };
  },

  toEntity(notificationDTO) {
    return {
      idNotif: notificationDTO.idNotif,
      user_id: notificationDTO.idUser,
      sender_id: notificationDTO.senderId,
      title: notificationDTO.title,
      message: notificationDTO.message,
      createdAt: notificationDTO.createdAt,
      read: notificationDTO.read,
      relatedEntityId: notificationDTO.relatedEntityId,
      entityType: notificationDTO.entityType,
    };
  },
};

module.exports = notificationMapper;
```

- **Explications** :
    - `toDTO` charge dynamiquement le `sender` avec `getSender()` (relation Sequelize définie dans `models/index.js`).
    - Les champs comme `senderLastName` sont mappés depuis l’objet `sender`.
    - `toEntity` ignore les champs du sender qui ne sont pas nécessaires pour l’entité (ils sont chargés via la relation).

#### 2. `mappers/recipeMapper.js`
Ce mapper gère `Recipe` -> `RecipeDTO`, `RecipeFormDTO` -> `RecipeDTO`, et `RecipeDTO` -> `Recipe`.

```javascript
const recipeMapper = {
  toDto(recipe) {
    return {
      id: recipe.idRecipe,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      preparation: recipe.preparation,
      category: recipe.category,
      image: recipe.image,
      creationDate: recipe.creationDate,
      updatedDate: recipe.updatedDate,
      userId: recipe.user_id,
      // user: user ? userMapper.toDto(user) : null, // Optionnel, décommenter si besoin
    };
  },

  toRecipeDTO(formDTO) {
    return {
      title: formDTO.title,
      description: formDTO.description,
      ingredients: formDTO.ingredients,
      preparation: formDTO.preparation,
      category: formDTO.category,
    };
  },

  toEntity(recipeDTO) {
    return {
      idRecipe: recipeDTO.id,
      title: recipeDTO.title,
      description: recipeDTO.description,
      ingredients: recipeDTO.ingredients,
      preparation: recipeDTO.preparation,
      category: recipeDTO.category,
      image: recipeDTO.image,
      creationDate: recipeDTO.creationDate,
      updatedDate: recipeDTO.updatedDate,
      user_id: recipeDTO.userId,
    };
  },
};

module.exports = recipeMapper;
```

- **Explications** :
    - `toDto` mappe tous les champs de `Recipe` vers `RecipeDTO`. Le champ `user` est commenté (on peut l’ajouter si tu veux inclure les infos de l’utilisateur).
    - `toRecipeDTO` transforme `RecipeFormDTO` en `RecipeDTO`, en ignorant les champs non présents dans le formulaire (ex. `id`, `image`).
    - `toEntity` mappe `RecipeDTO` vers l’entité Sequelize.

#### 3. `mappers/userMapper.js`
Ce mapper transforme `User` en `UserDTO`.

```javascript
const userMapper = {
  toDto(user) {
    return {
      idUser: user.idUser,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      address: user.address,
      profilePic: user.profilePic,
      created: user.created,
      // recipes: recipes ? recipes.map(recipeMapper.toDto) : [], // Optionnel, décommenter si besoin
    };
  },

  toEntity(userDTO) {
    return {
      idUser: userDTO.idUser,
      lastName: userDTO.lastName,
      firstName: userDTO.firstName,
      email: userDTO.email,
      password: userDTO.password, // Attention : à hacher dans le service
      address: userDTO.address,
      profilePic: userDTO.profilePic,
      created: userDTO.created,
    };
  },
};

module.exports = userMapper;
```

- **Explications** :
    - `toDto` omet `password` (comme dans ton DTO Spring Boot avec `@JsonIgnore`) et ignore `recipes` par défaut (décommentable si besoin).
    - `toEntity` inclut tous les champs nécessaires pour créer ou mettre à jour un `User`.

---

### Étape 2 : Mise à jour des services pour utiliser les mappers
On va ajuster les services existants pour appeler ces mappers au lieu des fonctions `toDTO` inline.

#### 1. Mise à jour de `services/authService.js`
Remplace la fonction `generateAuthResponse` :

```javascript
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const fileStorageService = require('./fileStorage');
const userMapper = require('../mappers/userMapper');

const saltRounds = 10;

const authService = {
  async register(userData, profileImage, res) {
    const { email, password, lastName, firstName, address } = userData;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('Email address already in use');

    let profilePic = null;
    if (profileImage && profileImage.size > 0) {
      profilePic = await fileStorageService.storeFile(profileImage, 'user', null);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      lastName,
      firstName,
      email,
      password: hashedPassword,
      address,
      profilePic,
    });

    return authService.generateAuthResponse(user, res);
  },

  async login(email, password, res) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return authService.generateAuthResponse(user, res);
  },

  // ... (refreshAccessToken, isRefreshTokenValid restent inchangés)

  async generateAuthResponse(user, res) {
    const accessToken = generateAccessToken(user.idUser, user.email);
    const refreshToken = generateRefreshToken(user.idUser, user.email);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      user: userMapper.toDto(user),
    };
  },

  logout(res) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 0,
    });
    return { message: 'Déconnexion réussie' };
  },
};

module.exports = authService;
```

#### 2. Mise à jour de `services/notificationService.js`
Remplace la fonction `toDTO` par un appel à `notificationMapper.toDTO` :

```javascript
const { Notification, User, Follower } = require('../models');
const io = require('../index').io;
const notificationMapper = require('../mappers/notificationMapper');

const notificationService = {
  async createNotification(userId, title, message) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    const notification = await Notification.create({ user_id: userId, title, message });
    return notificationMapper.toDTO(notification);
  },

  async getUserNotifications(userId) {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'sender' }],
    });
    return Promise.all(notifications.map(n => notificationMapper.toDTO(n)));
  },

  // ... (autres méthodes inchangées sauf ci-dessous)

  async sendFollowNotification(followerId, followedId) {
    const follower = await User.findByPk(followerId);
    const followed = await User.findByPk(followedId);
    if (!follower || !followed) throw new Error('User not found');

    const notification = await Notification.create({
      user_id: followedId,
      sender_id: followerId,
      title: 'New follower',
      message: `${follower.firstName || ''} ${follower.lastName} follows you.`,
      entityType: 'user',
    });

    const notificationDTO = await notificationMapper.toDTO(notification);
    io.emit(`notifications/${followedId}`, notificationDTO);
  },

  async sendRecipePublicationNotification(userId, recipeId, recipeTitle) {
    const author = await User.findByPk(userId);
    if (!author) throw new Error('User not found');

    const followers = await Follower.findAll({
      where: { followed_id: userId },
      include: [{ model: User, as: 'follower' }],
    });

    if (!followers.length) return;

    const title = 'New recipe';
    const message = `${author.firstName || ''} ${author.lastName} published a new recipe: ${recipeTitle}`;

    for (const follower of followers) {
      const notification = await Notification.create({
        user_id: follower.follower.idUser,
        sender_id: userId,
        title,
        message,
        relatedEntityId: recipeId,
        entityType: 'recipe',
      });

      const notificationDTO = await notificationMapper.toDTO(notification);
      io.emit(`notifications/${follower.follower.idUser}`, notificationDTO);
    }
  },

  // ... (autres méthodes inchangées)
};

module.exports = notificationService;
```

#### 3. Mise à jour de `services/recipeService.js`
Utilise `recipeMapper` :

```javascript
const { Recipe, User } = require('../models');
const fileStorageService = require('./fileStorage');
const notificationService = require('./notificationService');
const recipeMapper = require('../mappers/recipeMapper');
const { Op } = require('sequelize');

const recipeService = {
  async createRecipe(recipeData, recipeImage, userId) {
    let image = null;
    if (recipeImage && recipeImage.size > 0) {
      image = await fileStorageService.storeFile(recipeImage, 'recipe', null);
    }

    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const recipeDTO = recipeMapper.toRecipeDTO(recipeData); // Utilise le mapper pour RecipeFormDTO
    const recipe = await Recipe.create({
      ...recipeDTO,
      image,
      user_id: userId,
    });

    await notificationService.sendRecipePublicationNotification(userId, recipe.idRecipe, recipe.title);
    return recipeMapper.toDto(recipe);
  },

  async updateRecipe(recipeId, updatedRecipeData, newRecipeImage, userId) {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) throw new Error('Recipe not found');
    if (recipe.user_id !== userId) throw new Error('Unauthorized');

    const updatedDTO = recipeMapper.toRecipeDTO(updatedRecipeData); // Transforme RecipeFormDTO
    if (newRecipeImage && newRecipeImage.size > 0) {
      updatedDTO.image = await fileStorageService.storeFile(newRecipeImage, 'recipe', recipe.image);
    }

    await recipe.update(updatedDTO);
    return recipeMapper.toDto(recipe);
  },

  async findRecipeById(recipeId) {
    const recipe = await Recipe.findByPk(recipeId);
    return recipe ? recipeMapper.toDto(recipe) : null;
  },

  async findAllRecipes() {
    const recipes = await Recipe.findAll();
    return recipes.map(recipeMapper.toDto);
  },

  // ... (autres méthodes inchangées, juste remplacer this.toDTO par recipeMapper.toDto)
};

module.exports = recipeService;
```

#### 4. Mise à jour de `services/userService.js`
Utilise `userMapper` :

```javascript
const bcrypt = require('bcrypt');
const { User, Recipe } = require('../models');
const fileStorageService = require('./fileStorage');
const userMapper = require('../mappers/userMapper');
const { extractEmail } = require('../middleware/auth');

const userService = {
  async createUser(userData, profileImage) {
    const { email, password } = userData;
    if (await User.findOne({ where: { email } })) {
      throw new Error('Email address already in use');
    }

    const profilePic = profileImage && profileImage.size > 0
      ? await fileStorageService.storeFile(profileImage, 'user', null)
      : null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...userMapper.toEntity(userData), password: hashedPassword, profilePic });
    return userMapper.toDto(user);
  },

  async getUserProfileFromToken(token) {
    const email = extractEmail(token);
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    return userMapper.toDto(user);
  },

  // ... (autres méthodes inchangées, juste remplacer this.toDTO par userMapper.toDto)
};

module.exports = userService;
```

---

### Étape 3 : Création des contrôleurs et routes
On va maintenant créer les contrôleurs et connecter les services aux routes.

#### 1. `controllers/authController.js`
```javascript
const authService = require('../services/authService');

const authController = {
  async register(req, res) {
    try {
      const result = await authService.register(req.body, req.files?.profileImage, res);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await authService.login(req.body.email, req.body.password, res);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const accessToken = await authService.refreshAccessToken(refreshToken);
      res.json({ accessToken });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  async logout(req, res) {
    try {
      const result = authService.logout(res);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = authController;
```

#### 2. `routes/api.js`
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
```

---

### Étape 4 : Test
- Lance le serveur avec `npm run dev`.
- Teste avec Postman :
    - `POST http://localhost:3000/api/auth/register` avec un corps JSON et une image (`multipart/form-data`).
    - `POST http://localhost:3000/api/auth/login` avec `{ "email": "...", "password": "..." }`.

---

### Prochaines étapes
1. **Compléter les contrôleurs** : Ajoute des contrôleurs pour `recipeService`, `notificationService`, etc., en suivant le modèle ci-dessus.
2. **Front** : Vérifie que ton front Next.js consomme bien les DTOs et les messages WebSocket (`/ws`).
3. **Envoie-moi** : Si tu as besoin d’aide pour d’autres contrôleurs ou si tu veux affiner quelque chose, dis-le-moi !

On est presque finis (14 mars 2025, soirée). Continue avec les routes, et on finalise demain si besoin !