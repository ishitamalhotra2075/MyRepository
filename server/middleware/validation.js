const { body, query, validationResult } = require("express-validator");

// Generic middleware to check express-validator results and return clean JSON response
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed for request parameters",
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validation rules for ResearchGPT REST APIs
const validateChat = [
  body("query")
    .trim()
    .notEmpty().withMessage("Chat query is required")
    .isLength({ min: 2, max: 2000 }).withMessage("Query must be between 2 and 2000 characters"),
  body("paperIds")
    .optional()
    .isArray().withMessage("paperIds must be an array of string IDs"),
  handleValidationErrors
];

const validateCitationVerify = [
  body("citationText")
    .trim()
    .notEmpty().withMessage("Citation text or bibliography entry is required")
    .isLength({ min: 5, max: 3000 }).withMessage("Citation text must be between 5 and 3000 characters"),
  handleValidationErrors
];

const validateCompare = [
  body("paperIds")
    .isArray({ min: 1 }).withMessage("paperIds must be an array with at least 1 paper ID to compare"),
  handleValidationErrors
];

const validateReview = [
  body("topic")
    .trim()
    .notEmpty().withMessage("Research topic or synthesis question is required")
    .isLength({ min: 3, max: 500 }).withMessage("Topic must be between 3 and 500 characters"),
  body("paperIds")
    .optional()
    .isArray().withMessage("paperIds must be an array"),
  handleValidationErrors
];

const validateWritingAudit = [
  body("text")
    .trim()
    .notEmpty().withMessage("Academic text is required for auditing")
    .isLength({ min: 5, max: 10000 }).withMessage("Text must be between 5 and 10000 characters"),
  handleValidationErrors
];

const validateScholarSearch = [
  query("q")
    .trim()
    .notEmpty().withMessage("Search query 'q' parameter is required")
    .isLength({ min: 1, max: 200 }).withMessage("Search query must be under 200 characters"),
  handleValidationErrors
];

const validatePaperCreate = [
  body("title")
    .trim()
    .notEmpty().withMessage("Paper title is required")
    .isLength({ min: 3, max: 300 }).withMessage("Title must be between 3 and 300 characters"),
  body("abstract")
    .trim()
    .notEmpty().withMessage("Paper abstract is required")
    .isLength({ min: 10 }).withMessage("Abstract must be at least 10 characters"),
  body("year")
    .optional()
    .isInt({ min: 1900, max: 2030 }).withMessage("Year must be a valid 4-digit year"),
  body("authors")
    .optional()
    .isArray().withMessage("Authors must be an array of strings"),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateChat,
  validateCitationVerify,
  validateCompare,
  validateReview,
  validateWritingAudit,
  validateScholarSearch,
  validatePaperCreate
};
