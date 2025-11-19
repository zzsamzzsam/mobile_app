/* eslint-disable prettier/prettier */
import React from 'react'
import { List } from 'react-native-paper';

const AccordianList = ({
    children,
    ...other
}) => {
    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);

    return (
        <List.Accordion
            expanded={expanded}
            onPress={handlePress}
            {...other}
        >
            {children}
        </List.Accordion>
    )
}

export default AccordianList