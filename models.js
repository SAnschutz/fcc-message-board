const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    boardName: {
      type: String,
      required: true
    },
    threads: {
      type: [        
          {
            text: {
              type: String,
              required: true
            },
            created_on: {
              type: Date,
              default: Date.now
            }, 
            bumped_on: {
              type: Date,
              default: Date.now
            },
            reported: {
              type: Boolean,
              default: false
            },
            delete_password: {
              type: String,
              required: true
            },
            replies: {
              
              type: [
                
                
                {
                  text: {
                    type: String,
                    required: true
                  },
                  created_on: {
                    type: Date,
                    default: Date.now
                  }, 
                  bumped_on: {
                    type: Date,
                    default: Date.now
                  },
                  reported: {
                    type: Boolean,
                    default: false
                  },
                  delete_password: {
                    type: String,
                    required: true
                  }
                }
  ],            
  
              default: [],
              
            }
          }     
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);
const Board = mongoose.model('Board', boardSchema);


module.exports = {Board}