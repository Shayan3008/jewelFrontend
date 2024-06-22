import React, { useEffect, useState } from 'react';
import './InputField.css'; // CSS file for styling (optional)
import { handleInputChange } from '../../../utils/HelperUtils';

const InputField = ({ labelName, value, type, inputValue, setInputValue, name, disable, validationText, validator, max }) => {
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (value !== undefined || ((inputValue !== undefined) && (type !== 'text' || inputValue.length > 0)) || type === "date") {

      handleFocus()
    }
  }, [value, inputValue, type, validator])

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if ((inputValue === '') && value === undefined) {
      setFocused(false);
    }
  };


  const checking_type = (type === "number" && max !== null);
  let maxValue = checking_type ? max : null
  return (
    <div className={`input-container  ${focused ? 'focused' : ''} `}>
      <label className="input-label">{labelName}</label>
      <input
        className='styled_input'
        style={{ border: validator ? '1px solid red' : '' }}
        type={type == null ? 'text' : type}
        value={value == null ? inputValue  : value}
        onChange={(e) => {
          handleInputChange(e, setInputValue,type)
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        max={type === "date" ? new Date().toISOString().split("T")[0] : maxValue}
        disabled={value !== undefined || disable}
      />
      <p style={{
        display: validator ? 'block' : `none`,
        color: 'red',
        paddingTop: '2px'
      }}>{validationText}</p>
    </div>
  );
};

export default InputField;
