import { useEffect } from 'react';
import 'parsleyjs/dist/parsley';
import $ from 'jquery';

function ParsleyErrors(formClassName) {
  useEffect(() => {
    const form = $(`.${formClassName}`);
    form.parsley({
      errorClass: 'is-invalid',
      successClass: 'is-valid',
      errorsWrapper: '<span class="invalid-feedback"></span>',
      errorTemplate: '<div></div>',
      trigger: 'focusin',
    });
  }, [formClassName]);
}

export default ParsleyErrors;
