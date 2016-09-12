/**
 * Created by rockuo on 23.6.16.
 */

import $ from 'jquery';
import Gateway from 'trinity/Gateway';
import Events from 'trinity/utils/Events';


let counter = 0;
let last = 0;

/**
 * Validates name and creates "handle" from it
 * @param route {string}
 * @param sourceField  {HTMLInputElement}
 * @param outputField {HTMLInputElement}
 */
export function slugify(route, sourceField, outputField) {
    let myCounter = ++counter;
    Gateway.postJSON(route, {string: sourceField.value},
        (response) => {
            if(myCounter >= last) {
                outputField.value = response.body.handle;
                last = myCounter;
            }
        }, (err) => {
            if(DEVELOPLEMT){
                console.error(err);
            }
        }
    );
}

/**
 * TODO: @RichardBures comment
 * @param route
 * @param titleField
 * @param handleField
 * @returns {*}
 */
export function handleHandleGeneration(route, titleField, handleField) {
    if (titleField && handleField) {
        // TODO: @RichardBures Timer listener
        return Events.listen(titleField, 'input', () => {
            slugify(route, titleField, handleField);
        });
    } else {
        return ()=>{};
    }
}

// /**
//  * Initialize Floara editor
//  * Also adds removing error fn on trinityForm error
//  * TODO: @RichardBures use trinityForm error methods - @Fisa has to add method for it first
//  * @param element {object} - jquery object
//  * @param settings {object}
//  */
// export function initializeFroala(element, settings) {
//     element.froalaEditor(settings);
//     element.on('froalaEditor.input', function () {
//         console.log('input');
//         let button = $('.trinity-form-error');
//         if(button[0]) {
//             button[0].disabled = false;
//             button.first().removeClass('trinity-form-error');
//         }
//     });
// }