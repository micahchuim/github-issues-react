import React from 'react';


const Labels = ({ labels }) => {
  let labelMap = labels.map((label, index) => {
    return <span key={index} style={{ backgroundColor: "#" + label.color }} className={"label"}>{label.name}</span>
})
  return (
    <React.Fragment>
      {labelMap}
    </React.Fragment>
  )

}

export default Labels;