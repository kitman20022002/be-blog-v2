const express = require('express');
const router = new express.Router();
const eventController = require('../../controllers/v1/eventController');
const registerController = require('../../controllers/v1/registerController');
const loginController = require('../../controllers/v1/loginController');
const logoutController = require('../../controllers/v1/logoutController');
const userController = require('../../controllers/v1/userController');
const userProfileController = require('../../controllers/v1/userProfileController');
const commentController = require('../../controllers/v1/commentController');
const countryController = require('../../controllers/v1/countryController');
const searchController = require('../../controllers/v1/searchController');
const suggestController = require('../../controllers/v1/suggestController');
const passwordController = require('../../controllers/v1/passwordController');
const authMiddleware = require('../../middleware/authMiddleware');
import { logger } from '../../../loaders/logger';
import { NextFunction } from 'express';
import * as registerValidation from '../../validations/registerValidator';
import * as conceptController from '../../controllers/v1/conceptController';
import * as typesController from '../../controllers/v1/typesController';
function asyncMiddleware(fn:any) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((e) => {
      console.error(e.message);
      logger.error(e.message);
      next();
    });
  };
}

router.use((req: Request, res: Response, next: NextFunction) => {
  try {
    for (const layer of router.stack) {
      if (layer.route) {
        for (const method in layer.route.methods) {
          if (layer.route.methods[method]) {
            layer.route.methods[method] = asyncMiddleware(layer.route.methods[method]);
          }
        }
      }
    }
    next();
  } catch (e) {
    console.error('fxx i');
  }
});

router.get('/types/:slug', typesController.index);
router.get('/category/:category/stack/:stack/types/:slug', conceptController.index);

router.post('/register', registerValidation.index, registerController.register);
router.post('/login', loginController.login);
router.get('/verify/:token', registerController.verify);
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);

router.all('*', authMiddleware.isAuth);
router.post('/events', eventController.store);
router.get('/events', eventController.index);
router.get('/events/:eventId', eventController.show);
router.post('/events/:eventId/subscribe', eventController.subscribe);
router.post('/events/:eventId/unsubscribe', eventController.unsubscribe);
router.post('/events/:eventId/report', eventController.report);
router.get('/events/generate', eventController.generateEvent);
router.post('/events/suggest', eventController.suggestEvent);

router.get('/events/:eventId/bookmark', userController.bookmark);

router.get('/events/:eventId/remove-bookmark', userController.removeBookmark);

router.post('/comments', commentController.store);
router.get('/comments/:eventId', commentController.show);
router.put('/comments/:id', commentController.update);
router.delete('/comments/:id', commentController.destroy);

router.post('/logout', logoutController.logout);

router.post('/suggest', suggestController.index);
// router.post('/change-password', passwordController.changePassword);

// router.get('/account/me', userController.show);

// router.get('/users', userController.index);
// router.get('/users/:id', userController.show);
router.get('/user/me', userController.showMe);
router.put('/user/me', userController.updateMe);
router.put('/user/hobbies', userController.updateHobbies);
router.put('/user/locations', userController.updateLocations);
router.put('/user/range', userController.updateLocations);

router.get('/users/:id', userProfileController.show);

router.get('/countries', countryController.index);
router.get('/states', countryController.states);


router.get('/search', searchController.index);


router.get('/', (req:any, res:any)=> {
  res.send('sdf');
});

module.exports = router;
