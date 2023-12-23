# frozen_string_literal: true

class FlexStrategy
   attr_reader :model, :run_method

   def initialize
      @strategy = FactoryBot.strategy_by_name(:create).new
   end

   delegate :association, to: :@strategy

   def result evaluation
      @run_method = evaluation.instance_variable_get(:@to_create)
      @model = evaluation.instance_variable_get(:@attribute_assigner).instance_variable_get(:@build_class)

      evaluation.instance_variable_set(:@to_create, method(:first_or_create))

      @strategy.result(evaluation)
   end

   def first_or_create object_in, *args
      attrs = object_in.attributes.select { |key, value| value }.to_h
      object = model.where(attrs).first || object_in
      if object_in.send("#{object_in.class.primary_key}=", object.send(object_in.class.primary_key))
         object_in.reload
      end

      run_method[object_in]
   end
end

FactoryBot.register_strategy(:first_or_create, FlexStrategy)
