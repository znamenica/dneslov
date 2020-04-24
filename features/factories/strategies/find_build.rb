class FindBuildStrategy
  def initialize
    @strategy = FactoryBot.strategy_by_name( :build ).new
  end

  delegate :association, to: :@strategy

  def result e
    aa = e.instance_variable_get(:@attribute_assigner)
    klass = aa.instance_variable_get(:@build_class)
    attrs = e.instance_variable_get(:@evaluator)&.instance_variable_get(:@overrides) || {}

    klass.find_by( attrs ) || @strategy.result( e )
  end
end

FactoryBot.register_strategy( :find_build, FindBuildStrategy )
