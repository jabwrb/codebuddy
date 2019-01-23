/**
 * Module dependencies
 */
const express = require('express')

const auth = require('../middlewares/auth')
const webController = require('../controllers/webController')
const { catchErrors } = require('../handlers/errorHandlers')

const router = express.Router()

/**
 * `Dashboard` route used as `/dashboard`
 * Finding user projects from database and pass results to the dashboard file
 * @method {GET} return rendered `dashboard.pug`
 */
router.get('/', auth.isSignedIn, catchErrors(webController.getLobby))
router.get('/searchUser', auth.isSignedIn, catchErrors(webController.searchUser))
router.get('/searchUserByPurpose', auth.isSignedIn, catchErrors(webController.searchUserByPurpose))
router.put('/acceptInvite', auth.isSignedIn, catchErrors(webController.acceptInvite))
router.delete('/declineInvite', auth.isSignedIn, catchErrors(webController.declineInvite))
router.post('/editProject', auth.isSignedIn, catchErrors(webController.editProject))
router.delete('/deleteProject', auth.isSignedIn, catchErrors(webController.deleteProject))
router.get('/getProgress', auth.isSignedIn, catchErrors(webController.getProgress))
// router
// .use(auth.isSignedIn)
// .route('/searchUser')
// .get(webController.searchUser)

/**
 * Expose `router`
 */
module.exports = router
