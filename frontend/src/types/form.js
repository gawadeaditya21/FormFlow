export const SMART_FIELDS = [
  {
    id: 'full-name',
    name: 'Full Name',
    icon: 'User',
    config: {
      type: 'short-text',
      label: 'What is your full name?',
      required: true,
    },
  },
  {
    id: 'email',
    name: 'Email Address',
    icon: 'Mail',
    config: {
      type: 'short-text',
      label: 'What is your email address?',
      required: true,
      validation: { type: 'email' },
    },
  },
  {
    id: 'phone',
    name: 'Phone Number',
    icon: 'Phone',
    config: {
      type: 'short-text',
      label: 'What is your phone number?',
      required: true,
      validation: { type: 'phone' },
    },
  },
  {
    id: 'gender',
    name: 'Gender',
    icon: 'Users',
    config: {
      type: 'dropdown',
      label: 'What is your gender?',
      required: false,
    },
  },
  {
    id: 'city',
    name: 'City',
    icon: 'MapPin',
    config: {
      type: 'short-text',
      label: 'What city do you live in?',
      required: false,
    },
  },
  {
    id: 'dob',
    name: 'Date of Birth',
    icon: 'Calendar',
    config: {
      type: 'date',
      label: 'What is your date of birth?',
      required: false,
    },
  },
];

export const QUESTION_TYPES = [
  { type: 'short-text', name: 'Short Answer', icon: 'Type' },
  { type: 'paragraph', name: 'Paragraph', icon: 'AlignLeft' },
  { type: 'multiple-choice', name: 'Multiple Choice', icon: 'CircleDot' },
  { type: 'checkbox', name: 'Checkboxes', icon: 'CheckSquare' },
  { type: 'dropdown', name: 'Dropdown', icon: 'ChevronDown' },
  { type: 'date', name: 'Date', icon: 'Calendar' },
  { type: 'file-upload', name: 'File Upload', icon: 'Upload' },
];
