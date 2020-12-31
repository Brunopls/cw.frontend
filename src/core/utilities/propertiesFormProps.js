exports.titleProps = {
  rules: [
    {
      type: "string",
      required: true,
      message: "Please provide a description!",
    },
  ],
  tooltip: {
    title: "What would you like to be the title of your listing?",
    placement: "leftBottom",
  },
};

exports.descriptionProps = {
  rules: [
    {
      type: "string",
      required: true,
      message: "Please provide a description!",
    },
  ],
  tooltip: {
    title: "What about your property makes it special?",
    placement: "leftBottom",
  },
};

exports.locationProps = {
  rules: [
    { type: "string", required: true, message: "Please specify a location!" },
  ],
  tooltip: {
    title: "Where is your property located?",
    placement: "leftBottom",
  },
};

exports.askingPriceProps = {
  rules: [{ type: "string" }],
  tooltip: {
    title: "What is your asking price for this property?",
    placement: "leftBottom",
  },
};

exports.categoryProps = {
  rules: [
    { type: "string", required: true, message: "Please specify a category!" },
  ],
  tooltip: {
    title: "Which of the following categories best describes your property?",
    placement: "leftBottom",
  },
};

exports.featuresProps = {
  rules: [
    {
      type: "array",
      required: true,
      message: "Please specify at least one feature!",
    },
  ],
  tooltip: {
    title: "Which of the following features best describe your property?",
    placement: "leftBottom",
  },
};

exports.visibleProps = {
  rules: [{ type: "boolean" }],
  tooltip: {
    title: "Would you like other users to be able to see this listing?",
  },
};

exports.underOfferProps = {
  rules: [{ type: "boolean" }],
  tooltip: {
    title: "Are you open to receiving offers on this property?",
    placement: "leftBottom",
  },
};

exports.highPriorityProps = {
  rules: [{ type: "boolean" }],
  tooltip: {
    title:
      "Would you like this property to take precedence over others in your portfolio?",
    placement: "leftBottom",
  },
};
