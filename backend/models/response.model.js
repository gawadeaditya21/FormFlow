const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      fieldId: {
        type: String,
        required: true,
      },

      //This model uses the Attribute Pattern. Instead of dynamic keys, it stores answers as k (key/type) and v (value) pairs. 
      // This allows you to index specific value types (like numbers) for fast analytics later (e.g., "Find average rating").
      // The Attribute Pattern [cite: 290]
      // k: The type of value (e.g., 'text_val', 'num_val', 'date_val')
      k: {
        type: String,
        required: true,
      },

      v: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  ],
});

// Compound Index for Analytics Speed [cite: 297]
// Allows efficient queries like: "Find all answers for field 'q1' where value is 5"
ResponseSchema.index({ "answers.fieldId": 1, "answers.v": 1 });

module.exports = mongoose.model("Response", responseSchema);
