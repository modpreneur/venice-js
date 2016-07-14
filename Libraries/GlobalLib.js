/**
 * Created by rockuo on 23.6.16.
 */

import Gateway from 'trinity/Gateway';
import Events from 'trinity/utils/Events';
import $ from 'jquery';

let counter=0;
let last = 0;
/**
 *
 * @param route {string}
 * @param sourceField  {HTMLInputElement}
 * @param outputField {HTMLInputElement}
 */
export function slugify(route,sourceField, outputField) {
    let myCounter = ++counter;
    Gateway.postJSON(route, {string: sourceField.value}, function (response) {
        if(myCounter >= last) {
            outputField.value = response.body.handle;
            last = myCounter;
        }
    }, err => {
        console.error(err);
    });
}

export function handleHandleGeneration(route,titleField,handleField) {
    if (titleField && handleField) {
        return Events.listen(titleField, 'input', () => {
            slugify(route, titleField, handleField);
        });
    }else {
        return ()=>{};
    }
}


export function inicializeFroala(element, settings) {
    element.froalaEditor(settings);
    element.on('froalaEditor.input', function () {
        console.log('input');
        let button = $('.trinity-form-error');
        if(button) {
            button[0].disabled = false;
            button.first().removeClass('trinity-form-error');
        }
    });
}