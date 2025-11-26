const mongoose =  require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },

  tags: [
    {
      type: String,
      required: true,
      enum: [
        "array",
        "linkedlist",
        "graph",
        "DP",
        "tree",
        "string",
        "hash table",
        "sorting",
        "binary search",
        "stack",
        "queue",
        "heap",
        "greedy",
        "recursion",
        "backtracking",
        "bit manipulation",
        "math",
        "simulation",
        "two-pointers",
      ],
    },
  ],

  visibleTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],

  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],

  starterCode: [
    {
      language: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
    },
  ],

  referenceSolution: [
    {
      language: {
        type: String,
        required: true,
      },
      completeCode: {
        type: String,
        required: true,
      },
    },
  ],

  problemCreator: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Problem = mongoose.model('problem', problemSchema);

module.exports = Problem;