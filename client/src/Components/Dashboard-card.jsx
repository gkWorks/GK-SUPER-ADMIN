
import PropTypes from 'prop-types';

const Card = ({ title, subtitle, icon, color }) => {
  return (
    <div
      className={`shadow-md rounded-lg p-4 flex flex-col w-64 h-30 ${color} bg-white`}
    >
      <div className="mb-2">
        <h3 className="text-3xl font-bold">{title}</h3>
        <span className="text-sm font-medium text-gray-600">{subtitle}</span>
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-end">
        <img src={icon} alt="icon" className="h-10 w-10" />
      </div>
    </div>
  );
};

// Define prop types (Optional)
Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
};

// Default props (Optional)
Card.defaultProps = {
  color: 'bg-gray-100', // Default color if not provided
};

export default Card;
