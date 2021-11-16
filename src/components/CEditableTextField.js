import * as React from "react";
import { render } from "react-dom";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(
  createStyles({
    name: { "font-size": "50px" }
  })
);

export default function CEditableTextField(props: any)
{
  const classes = useStyles(props);
  console.log(props);
  // const [name, setName] = React.useState("John Snow");

  const [isNameFocused, setIsNamedFocused] = React.useState(false);

  const bind = props.bind;
  const bindField = props.bindField;
  const initialField = props.initialField;

  let value = ((typeof(bind[bindField]) === 'undefined')
    ? bind[initialField]
    : bind[bindField]);
  // ((note)) ref doesn't work as TextField doesn't exist when running Typography's onClick
  // console.log({ isNameFocused });

  // ((todo)) create EditableField component
  // ((todo)) put cursor where user clicks rather than at the end
  return (
    <div className="editable-field">
      {!isNameFocused ? (
        <Typography
          className={classes.name}
          onClick={() => {
            setIsNamedFocused(true);
          }}
        >
          {value}
        </Typography>
      ) : (
        <TextField
          autoFocus
          inputProps={{ className: classes.name }}
//          value={bind[bindField]}
          onChange={event => props.setValue(bind, event.target.value) }
          onBlur={event => setIsNamedFocused(false)}
        />
      )}
    </div>
  );
}
