import {colors} from './variables'
import { button } from '../styles/mixins'

export default {
    form: {
        position: 'relative',
        maxWidth: 600,
        width: '100%',
        height: 300,
        margin: 'auto',
        border: `2px solid ${colors.mainColor}`,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.mainColor,
        '& button': button(10),
        '@media (max-width:650px)':{
            width:'90%'
        }
    },

    inputContainer:{
        width:'60%',
        display:'flex',
        
        '& input': {
            marginLeft:'auto',
            width:'70%',
            marginBottom: 20,
            border: `2px solid ${colors.mainColor}`,
            padding: 5,
            color: colors.mainColor

        },
    },
    title: {
        position: 'absolute',
        top: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: colors.mainColor

    },
    error: {
        color: 'red',
        position: 'relative',
        marginBottom: 10
    }
}