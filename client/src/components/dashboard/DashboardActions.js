import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const DashboardActions = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Link to='/edit-profile' >
      <Button variant="outlined" color="primary">
        Edit Shop Info
      </Button>
      </Link>
      <Link to='/add-dish' >
      <Button variant="outlined" color="primary">
        Add dishes
      </Button>
      </Link>
      {/* <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> Add Education
      </Link> */}
    </div>
  );
};

export default DashboardActions;
