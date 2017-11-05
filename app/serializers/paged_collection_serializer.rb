class PagedCollectionSerializer < ActiveModel::Serializer::CollectionSerializer
   def as_json *args
      serializable_hash ;end

   def serializable_hash(adapter_options = {},
                         options = {},
                         adapter_instance = ActiveModel::Serializer.serialization_adapter_instance.new(self))
      {
         list: super,
         page: @options[:page],
         total: @options[:total], } ;end;end
