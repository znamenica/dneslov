FactoryBot.define do
   factory :event do
      happened_at { Date.today.to_s }
      type { 'Canonization' }

      association :item
      association :memory
      association :place
      after( :build ) do |e, _|
         e.kinds << (EventKind.find_by(kind: 'Canonization') ||
                     build( :event_kind, kind: 'Canonization' ));end;end;end
