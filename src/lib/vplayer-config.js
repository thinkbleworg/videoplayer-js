const Config = {
  autoplay: false,
  preload: 'auto',
  loop: false,
  muted: false,
  enableCaptions: false,
  customUI: false,
  src: [],
  speed: 1.0,
  isModal: false,
  modalClass: '',
  lang: 'en'
};

const Settings = [
  {
    label: 'autoplay',
    title: 'Autoplay',
    role: 'checkbox',
    value: false
  },
  {
    label: 'speed',
    title: 'Speed',
    role: 'dropdown',
    options: [
      {
        label: '0.25',
        value: 0.25,
        selected: false
      },
      {
        label: '0.50',
        value: 0.50,
        selected: false
      },
      {
        label: '0.75',
        value: 0.75,
        selected: false
      },
      {
        label: 'Normal',
        value: 1,
        selected: true
      },
      {
        label: '1.25',
        value: 1.25,
        selected: false
      },
      {
        label: '1.50',
        value: 1.50,
        selected: false
      },
      {
        label: '1.75',
        value: 1.75,
        selected: false
      },
      {
        label: '2.00',
        value: 2.00,
        selected: false
      }
    ]
  }
];

export default { Config, Settings };
