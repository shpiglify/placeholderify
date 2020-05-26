const _ = require('lodash')
/*
    the second argument to placeholderify is optional config to the function.
    ignoreKeys option:
        the function's default behavior is to ignore (not replacing) the 'id' and 'type' keys
        on ignoreKeys object - true to ignore, false to unignore
    removeKeys option:
        the function's default behavior is to remove the 'compId' and 'parId' keys
        on removeKeys object - true to remove, false to keep it
*/


function placeholderify(object,options = {ignoreKeys:{},removeKeys:{}}){

    let removeKeys = {
        compId:true,
        parId:true
    }

    let ignoreKeys = {
        type:true,
        id:true,
    }

    ignoreKeys = {...ignoreKeys,...options.ignoreKeys}
    removeKeys = {...removeKeys,...options.removeKeys}
    removeKeys = Object.keys(removeKeys).filter((key)=>removeKeys[key])
    object = _.omit(object,removeKeys)
    

    function valueToPlaceholder(key,value){   
        let placeholder = ''
        const upperCaseKey = key.toUpperCase()
        if(_.isString(value)){
            placeholder = `'{{${upperCaseKey}}}'`
        } else{
            placeholder = `{{${upperCaseKey}}}`
        }
        return placeholder
    }
    
    function valuesToPlaceholdersInTreeLevel(objectTreelevel,prefix = ''){   
        for(const key in objectTreelevel){
            if(ignoreKeys[key]) continue;
            const value = objectTreelevel[key]
            const generatedKey = prefix ?  prefix +'_'+ key : key 
            if( _.isFunction(value) || _.isObjectLike(value) || _.isArray(value)){
                objectTreelevel[key] = valuesToPlaceholdersInTreeLevel(value,generatedKey)
            } else {
                objectTreelevel[key] = valueToPlaceholder(generatedKey,value)
            }
        }
        return objectTreelevel
    }
    return valuesToPlaceholdersInTreeLevel(object)
}

module.exports = placeholderify  