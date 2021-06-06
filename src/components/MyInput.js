import {TextField, withStyles} from "@material-ui/core";

const MyInput = withStyles({
  root: {
    '& .MuiInputBase-root': {
      height: '40px',
      width: '250px'
    },
    '& label.Mui-focused': {
      color: '#F7A053',
    },
    '& input': {
      height: '5px',
    },
    '& .MuiInputLabel-formControl': {
      top: '-7px'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#F7A053',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#F7A053',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F7A053',
      },
    },
  },
})(TextField);

export default MyInput;