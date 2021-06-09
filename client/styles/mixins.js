import { colors } from './variables'

function button(padding, mLeft, mRight) {
    return {
        backgroundColor: colors.mainColor,
        cursor: 'pointer',
        color: '#fff',
        padding: `${padding}px 20px`,
        border: 'none',
        borderRadius: 5,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: colors.hoverColor,
        },
        marginLeft: mLeft,
        marginRight: mRight
    }
}

function header() {
    return {
        textAlign: 'center',
        display: 'block',
        marginBottom: 10,
        fontWeight: 'bold',
        color: colors.mainColor
    }
}

function pagination() {
    return {
        textAlign: 'center',
        '& a': {
            textDecoration: 'none',
            color: colors.mainColor,
            fontSize: '2rem',
            fontWeight: 'bold',
            cursor: 'pointer'
        }
    }
}


export {
    button,
    header,
    pagination
}