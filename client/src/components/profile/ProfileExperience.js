import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';

const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description }
}) => (
  <div>
    <p>
      <strong>Dish Name: </strong> {title}
    </p>
    <p>
      <strong>Cuisine: </strong> {company}
    </p>
    <p>
      <strong>Price: </strong> {location}
    </p>
    <p>
      <strong>About Dish: </strong> {description}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
