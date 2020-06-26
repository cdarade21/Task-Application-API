const express = require('express')
const router = new express.Router()
const Task = require('./../models/task.js')
const auth = require('./../middleware/auth.js')

router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id})

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
   
//     task.save().then(()=>{
//         res.status(201).send(task)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
 })

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({owner:req.user._id})
        //console.log(tasks)
        //res.send(tasks)    
        // Another Solution
         await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
         }).execPopulate() 
         res.send(req.user.tasks)      
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.findById({_id}).then((task)=>{
    //     if(!task){
    //         res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.patch('/tasks/:id', auth, async (req, res) =>{
    const keys = Object.keys(req.body);
    const allowed = ['description', 'completed']
    const isAllowed = keys.every((key)=> allowed.includes(key))

    if(!isAllowed) {
        return res.status(400).send({error: "Invalid Update request on unfound property!"})
    }

    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        //const task = await Task.findByIdAndUpdate({_id}, req.body, {new:true, runValidators:true})
        if(!task){
            return res.status(404).send()
        }

        keys.forEach((key)=>{
            task[key] = req.body[key]
        })

        await task.save()
        
        res.send(task)
    } catch (e) {
        res.status(400).send(e)   
    }
} )

router.delete('/tasks/:id', auth,  async (req, res)=> {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router