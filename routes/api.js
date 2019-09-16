/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const Board =  require('../models.js').Board
const Thread = require('../models.js').Thread
const Reply = require('../models.js').Reply
const Mongoose = require('mongoose')

module.exports = function (app) {
  
  
   app.route('/api/threads/:board').get(async function(req, res){
     try {
       const currentBoard = await Board.findOne({boardName: req.params.board})
       res.send(currentBoard.threads)

       } catch(e) {
       console.log(e); 
     }
   });
  
  app.route('/api/threads/:board').post(function(req, res){
    const boardName = req.params.board;
    const thread = req.body
    try{
    Board.findOne({boardName}).then(board => {
      if (!board) {
        const newBoard = new Board({boardName});
        newBoard.threads.push(thread)
        newBoard.save()
        return res.send(newBoard.threads)
        res.redirect(`/b/${boardName}/`)

      }
      board.threads.push(thread)
      board.save()
      res.redirect(`/b/${boardName}/`)

    })
    // res.json(newThread)
    } catch(e){
      console.log(e)
    }
  });
  
  
  
   
  app.route('/api/threads/:board').delete(function(req, res){
    const boardName = req.params.board;
    const {thread_id, delete_password} = req.body
    try{
    Board.findOne({boardName}).then(board => {
      for (let i=0; i<board.threads.length; i++){
        if (board.threads[i]._id.toString() === thread_id){
          
          if (board.threads[i].delete_password === delete_password){
            board.threads.splice(i, i+1);
            board.save()
            return res.send('success')            
            res.redirect(`/b/${boardName}/`)
          } else {
            return res.send('incorrect password')
        }
        }
        
      }
      
    })
    } catch(e){
      console.log(e)
    }
  });
  

app.route('/api/threads/:board').put(function(req, res){
  const boardName = req.params.board
  const {report_id} = req.body
  Board.findOne({boardName}).then(board => {
    for (let i=0; i<board.threads.length; i++){
      if (board.threads[i]._id.toString() === report_id){
        board.threads[i].reported = true;
        board.save()
        return res.send('success')
        res.redirect(`/b/${boardName}/`)

      }
    }
  })
})
  
  
  app.route('/api/replies/:board').post(function(req, res){
    
    const {thread_id, text, delete_password } = req.body
    const reply = {text, delete_password}
    const boardName = req.params.board
    const redirectPath = `/b/${boardName}/`
    
try{
  Board.findOne({boardName}).then(board => {
    board.threads.map(thread => {
      if (thread._id.toString() === thread_id) {
        thread.replies.push(reply)
        thread.bumped_on = Date.now()
      }
    })
    board.save()
  })
} catch(e) {
  console.log(e)
}
    res.redirect(redirectPath)
  });

app.route('/api/replies/:board').put(function(req, res){
  const boardName = req.params.board;
      const {reply_id, thread_id} = req.body
    try{
      Board.findOne({boardName}).then(board => {
        board.threads.map((thread) => {
          if (thread._id.toString() === thread_id) {
            for (let i=0; i<thread.replies.length; i++){
              if (thread.replies[i]._id.toString() === reply_id){
                thread.replies[i].reported = true
                board.save()
                return res.send('success')
                res.redirect(`/b/${boardName}/`)                
              } 
            }
          }
        })
      })   
  } catch(e) {
    console.log(e)
    res.send()
  }

  
})

app.route('/api/replies/:board').delete(function(req, res){
    const boardName = req.params.board;
    const {thread_id, reply_id, delete_password} = req.body
    try{
    Board.findOne({boardName}).then(board => {
      board.threads.map((thread) => {
        if (thread._id.toString() === thread_id) {
          for (let i=0; i<thread.replies.length; i++){
            if (thread.replies[i]._id.toString() === reply_id){
              if(thread.replies[i].delete_password === delete_password){
                thread.replies[i].text = '[deleted]'
                            board.save()
            return res.send('success')
            res.redirect(`/b/${boardName}/`)                
              } else {
                return res.send('incorrect password')
                res.redirect(`/b/${boardName}/`)
                
              }
            }
          }
        }
      })   
    })
  } catch(e) {
    console.log(e)
    res.send()
  }
});
}