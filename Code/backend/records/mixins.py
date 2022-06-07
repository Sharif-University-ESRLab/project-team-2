
# Dynamic Field Mixins for Django REST Framework allowing for serializers to act on fields specified at runtime.
# Source: https://stackoverflow.com/questions/23643204/django-rest-framework-dynamically-return-subset-of-fields
class DynamicFieldsSerializerMixin(object):

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsSerializerMixin, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
