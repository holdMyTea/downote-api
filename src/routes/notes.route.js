import express from 'express'

import controller from '../controllers/notes.controller'

const router = express()

router.get('/', controller.getAll)

router.put('/reorder', controller.reorder)

export default router
