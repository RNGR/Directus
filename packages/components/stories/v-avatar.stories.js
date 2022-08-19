import VAvatar from '../src/components/v-avatar.vue';
document.body.classList.add('light')



export default {
  title: 'Example/VAvatar',
  component: VAvatar,
  argTypes: {
    
  },
};

const Template = (args) => ({
  setup() {
    return { args };
  },
  template: '<v-avatar v-bind="args" v-on="args" ><v-icon name="person" /></v-avatar>',
});

export const Primary = Template.bind({});
Primary.args = {
};