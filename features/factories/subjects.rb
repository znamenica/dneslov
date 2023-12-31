FactoryBot.define do
   factory :subject do
      key { 'SubjectKind' }
      kind_code { 'SubjectKind' }
      meta { "{}" } ;end

   factory :subject_kind, parent: :subject, class: :Subject do
      key { 'SubjectKind' }
      kind_code { 'SubjectKind' }

      association :kind, factory: :subject, key: "SubjectKind", strategy: :find_build end

   factory :event_kind, parent: :subject, class: :Subject do
      key { FFaker::Name.name }
      kind_code { 'EventKind' }

      association :kind, factory: :subject_kind, key: "EventKind", strategy: :find_build end

   factory :language, parent: :subject, class: :Subject do
      key { 'ру' }
      kind_code { 'Language' }

      association :kind, factory: :subject_kind, key: "Language", strategy: :find_build end

   factory :alphabeth, parent: :subject, class: :Subject do
      key { 'РУ' }
      kind_code { 'Alphabeth' }

      association :kind, factory: :subject_kind, key: "Alphabeth", strategy: :find_build end

   factory :name_kind, parent: :subject, class: :Subject do
      key { 'наречёное' }
      kind_code { 'NameKind' }

      association :kind, factory: :subject_kind, key: "NameKind", strategy: :find_build end


   factory :name_bind, parent: :subject, class: :Subject do
      key { 'несвязаное' }
      kind_code { 'NameBind' }

      association :kind, factory: :subject_kind, key: 'NameBind', strategy: :find_build end;end
