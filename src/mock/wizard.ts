import type { Application } from "../types";

export const application: Application = {
  values: {
    '650070350698dea57335afe6': '',
    '650070350698dea57335aff0': 'bar',
    '650070340698dea57335afcd': null,
    '650070340698dea57335afcf': '',
    '650070350698dea57335afee': '',
    '650070350698dea57335afe4': [],
    '650070350698dea57335aff2': 'baz'
  },
  forms: [
    {
      id: '650070350698dea57335afde',
      name: 'Form 1',
      sections: [
        {
          id: '650070350698dea57335afdb',
          name: 'Section 1',
          questions: [
            { id: '650070340698dea57335afcd', hide: false },
            { id: '650070340698dea57335afcf', hide: false }
          ]
        },
        {
          id: '650070350698dea57335afdc',
          name: 'Section 2',
          questions: [{ id: '650070340698dea57335afd1', hide: true }]
        }
      ]
    },
    {
      id: '650070350698dea57335afe8',
      name: 'Form 2',
      sections: [
        {
          id: '650070350698dea57335b00c',
          name: 'Section 1',
          questions: [
            { id: '650070350698dea57335afe4', hide: false },
            { id: '650070350698dea57335afe6', hide: false }
          ]
        }
      ]
    },
    {
      id: '650070350698dea57335aff6',
      name: 'Form 3',
      sections: [
        {
          id: '650070350698dea57335aff3',
          name: 'Section 1',
          questions: [
            { id: '650070350698dea57335afee', hide: false },
            { id: '650070350698dea57335aff0', hide: false }
          ]
        },
        {
          id: '650070350698dea57335aff4',
          name: 'Section 2',
          questions: [{ id: '650070350698dea57335aff2', hide: false }]
        }
      ]
    }
  ]
};