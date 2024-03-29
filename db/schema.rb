# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_12_13_185132) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "btree_gin"
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "calendaries", id: :serial, force: :cascade do |t|
    t.string "date"
    t.string "language_code"
    t.string "alphabeth_code"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "place_id"
    t.string "author_name"
    t.string "council"
    t.boolean "licit", default: false
    t.jsonb "meta"
    t.index ["meta"], name: "index_calendaries_on_meta", using: :gin
  end

  create_table "canto_memories", id: :serial, force: :cascade do |t|
    t.integer "canto_id", null: false
    t.integer "memory_id", null: false
    t.index ["canto_id", "memory_id"], name: "canto_memories_index", unique: true
  end

  create_table "coverings", force: :cascade do |t|
    t.bigint "place_id", comment: "Ссылка на место"
    t.bigint "memory_id", comment: "Ссылка на память"
    t.datetime "add_date", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["memory_id", "place_id"], name: "index_coverings_on_memory_id_and_place_id", unique: true
    t.index ["memory_id"], name: "index_coverings_on_memory_id"
    t.index ["place_id"], name: "index_coverings_on_place_id"
  end

  create_table "descriptions", id: :serial, force: :cascade do |t|
    t.string "language_code", null: false
    t.integer "describable_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "describable_type", null: false
    t.string "alphabeth_code", null: false
    t.string "type"
    t.text "text"
    t.index "md5(text)", name: "descriptions_text_index"
    t.index ["alphabeth_code"], name: "index_descriptions_on_alphabeth_code"
    t.index ["describable_id", "describable_type", "alphabeth_code", "language_code", "type"], name: "describable_alphabeth_language_type_index", unique: true
    t.index ["describable_id", "describable_type", "alphabeth_code"], name: "describable_id_type_alphabeth_code_index"
    t.index ["describable_id", "describable_type"], name: "index_descriptions_on_describable_id_and_describable_type"
    t.index ["id", "language_code", "type", "describable_id", "describable_type"], name: "index_on_id_language_code_type_and_describables"
    t.index ["id", "type", "describable_id", "describable_type"], name: "index_on_id_type_and_describables"
    t.index ["language_code", "alphabeth_code", "type", "describable_id", "describable_type"], name: "index_on_language_code_alphabeth_code_type_and_describables"
    t.index ["language_code", "type", "describable_id", "describable_type"], name: "index_on_language_code_type_and_describables"
    t.index ["language_code"], name: "index_descriptions_on_language_code"
    t.index ["type"], name: "index_descriptions_on_type"
  end

  create_table "events", id: :serial, force: :cascade do |t|
    t.string "happened_at"
    t.integer "memory_id", null: false
    t.string "kind_code", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "place_id"
    t.integer "item_id"
    t.string "person_name"
    t.integer "type_number"
    t.string "about_string"
    t.string "tezo_string"
    t.string "order"
    t.string "council"
    t.index ["about_string"], name: "index_events_on_about_string"
    t.index ["council"], name: "index_events_on_council"
    t.index ["happened_at"], name: "index_events_on_happened_at"
    t.index ["item_id"], name: "index_events_on_item_id"
    t.index ["kind_code", "memory_id", "item_id"], name: "index_events_on_item_id_and_type_and_memory_id"
    t.index ["kind_code"], name: "index_events_on_kind_code"
    t.index ["memory_id"], name: "index_events_on_memory_id"
    t.index ["order"], name: "index_events_on_order"
    t.index ["person_name"], name: "index_events_on_person_name"
    t.index ["place_id"], name: "index_events_on_place_id"
    t.index ["tezo_string"], name: "index_events_on_tezo_string"
    t.index ["type_number"], name: "index_events_on_type_number"
  end

  create_table "image_attitudes", force: :cascade do |t|
    t.bigint "picture_id", null: false
    t.string "imageable_type"
    t.bigint "imageable_id"
    t.jsonb "meta", default: {}
    t.circle "pos"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["imageable_type", "imageable_id"], name: "index_image_attitudes_on_imageable"
    t.index ["meta"], name: "index_image_attitudes_on_meta", using: :gin
    t.index ["picture_id"], name: "index_image_attitudes_on_picture_id"
  end

  create_table "item_types", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "items", id: :serial, force: :cascade do |t|
    t.integer "item_type_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "links", id: :serial, force: :cascade do |t|
    t.string "url", null: false
    t.string "language_code"
    t.integer "info_id", null: false
    t.string "type", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "alphabeth_code"
    t.string "info_type", null: false
    t.bigint "resource_id"
    t.index ["alphabeth_code"], name: "index_links_on_alphabeth_code"
    t.index ["info_id"], name: "index_links_on_info_id"
    t.index ["info_type", "info_id"], name: "index_links_on_info_type_and_info_id"
    t.index ["info_type"], name: "index_links_on_info_type"
    t.index ["language_code"], name: "index_links_on_language_code"
    t.index ["resource_id"], name: "index_links_on_resource_id"
    t.index ["type"], name: "index_links_on_type"
    t.index ["url"], name: "index_links_on_url"
  end

  create_table "markups", force: :cascade do |t|
    t.bigint "scriptum_id", null: false
    t.bigint "reading_id", null: false
    t.integer "begin", null: false
    t.integer "end", null: false
    t.integer "position"
    t.index ["position"], name: "index_markups_on_position"
    t.index ["reading_id"], name: "index_markups_on_reading_id"
    t.index ["scriptum_id", "reading_id", "begin", "end"], name: "index_markups_on_scriptum_id_and_reading_id_and_begin_and_end", unique: true
    t.index ["scriptum_id", "reading_id"], name: "index_markups_on_scriptum_id_and_reading_id"
    t.index ["scriptum_id"], name: "index_markups_on_scriptum_id"
  end

  create_table "memo_orders", force: :cascade do |t|
    t.bigint "order_id"
    t.bigint "memo_id"
    t.datetime "updated_at", precision: nil
    t.datetime "created_at", precision: nil
    t.index ["memo_id"], name: "index_memo_orders_on_memo_id"
    t.index ["order_id", "memo_id"], name: "index_memo_orders_on_order_id_and_memo_id", unique: true
    t.index ["order_id"], name: "index_memo_orders_on_order_id"
  end

  create_table "memo_scripta", force: :cascade do |t|
    t.bigint "memo_id"
    t.bigint "scriptum_id"
    t.string "kind", comment: "Тип свѧзке от, к, или авторство"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kind"], name: "index_memo_scripta_on_kind"
    t.index ["memo_id", "scriptum_id", "kind"], name: "index_memo_scripta_on_memo_id_and_scriptum_id_and_kind", unique: true
    t.index ["memo_id"], name: "index_memo_scripta_on_memo_id"
    t.index ["scriptum_id"], name: "index_memo_scripta_on_scriptum_id"
  end

  create_table "memoes", id: :serial, force: :cascade do |t|
    t.string "add_date"
    t.string "year_date"
    t.integer "calendary_id", null: false
    t.string "bind_kind_code", null: false
    t.integer "bond_to_id"
    t.integer "event_id", null: false
    t.index ["add_date"], name: "index_memoes_on_add_date"
    t.index ["bind_kind_code"], name: "index_memoes_on_bind_kind_code"
    t.index ["bond_to_id", "bind_kind_code"], name: "index_memoes_on_bond_to_id_and_bind_kind_code"
    t.index ["bond_to_id"], name: "index_memoes_on_bond_to_id"
    t.index ["calendary_id", "event_id", "year_date"], name: "index_memoes_on_calendary_id_and_event_id_and_year_date", unique: true
    t.index ["calendary_id", "year_date"], name: "index_memoes_on_calendary_id_and_year_date"
    t.index ["calendary_id"], name: "index_memoes_on_calendary_id"
    t.index ["event_id", "bond_to_id", "id"], name: "index_memoes_on_event_id_and_bond_to_id_and_id"
    t.index ["event_id"], name: "index_memoes_on_event_id"
    t.index ["year_date"], name: "index_memoes_on_year_date"
  end

  create_table "memories", id: :serial, force: :cascade do |t|
    t.string "short_name", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "quantity"
    t.string "order"
    t.string "council"
    t.integer "base_year"
    t.index ["short_name"], name: "index_memories_on_short_name", unique: true
  end

  create_table "memory_binds", force: :cascade do |t|
    t.bigint "memory_id", comment: "Собственно память"
    t.bigint "bond_to_id", comment: "Память как целевая связка"
    t.string "kind", comment: "Вид связки: источник (Source) для списков икон, опора (Base) - иконы личностей, подобие (Similar) - для установления подобия"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bond_to_id"], name: "index_memory_binds_on_bond_to_id"
    t.index ["memory_id", "bond_to_id"], name: "index_memory_binds_on_memory_id_and_bond_to_id", unique: true
    t.index ["memory_id"], name: "index_memory_binds_on_memory_id"
  end

  create_table "memory_names", id: :serial, force: :cascade do |t|
    t.integer "memory_id", null: false
    t.integer "nomen_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "mode"
    t.boolean "feasible", default: false, null: false
    t.string "state_code", null: false
    t.index ["memory_id", "id"], name: "index_memory_names_on_memory_id_and_id"
    t.index ["memory_id", "nomen_id", "state_code"], name: "index_memory_names_on_memory_id_and_nomen_id_and_state_code", unique: true
    t.index ["memory_id"], name: "index_memory_names_on_memory_id"
    t.index ["nomen_id"], name: "index_memory_names_on_nomen_id"
  end

  create_table "names", id: :serial, force: :cascade do |t|
    t.text "text", null: false
    t.string "language_code", null: false
    t.string "alphabeth_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["alphabeth_code"], name: "index_names_on_alphabeth_code"
    t.index ["language_code"], name: "index_names_on_language_code"
    t.index ["text", "alphabeth_code"], name: "index_names_on_text_and_alphabeth_code", unique: true
    t.index ["text"], name: "index_names_on_text"
  end

  create_table "nomina", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "bond_to_id"
    t.bigint "root_id"
    t.string "bind_kind_name", null: false
    t.bigint "name_id", null: false
    t.string "bind_kind_path"
    t.string "modifier"
    t.index ["bond_to_id", "bind_kind_name"], name: "index_nomina_on_bond_to_id_and_bind_kind_name"
    t.index ["bond_to_id", "name_id"], name: "index_nomina_on_bond_to_id_and_name_id", unique: true
    t.index ["modifier"], name: "index_nomina_on_modifier"
    t.index ["name_id"], name: "index_nomina_on_name_id"
    t.index ["root_id"], name: "index_nomina_on_root_id"
  end

  create_table "orders", id: :serial, force: :cascade do |t|
    t.integer "significance", limit: 2, default: 32767, null: false
    t.index ["significance"], name: "index_orders_on_significance"
  end

  create_table "pictures", force: :cascade do |t|
    t.uuid "uid", null: false
    t.binary "digest", null: false
    t.string "url", null: false
    t.string "thumb_url", null: false
    t.string "type", null: false
    t.string "image", null: false
    t.integer "width", limit: 2, null: false
    t.integer "height", limit: 2, null: false
    t.jsonb "meta", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["digest"], name: "index_pictures_on_digest", unique: true
    t.index ["meta"], name: "index_pictures_on_meta", using: :gin
    t.index ["thumb_url"], name: "index_pictures_on_thumb_url", unique: true
    t.index ["uid"], name: "index_pictures_on_uid", unique: true
    t.index ["url"], name: "index_pictures_on_url", unique: true
  end

  create_table "places", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "readings", force: :cascade do |t|
    t.string "year_date"
    t.string "abbreviation"
    t.integer "kind"
    t.index ["abbreviation"], name: "index_readings_on_abbreviation"
    t.index ["kind"], name: "index_readings_on_kind"
    t.index ["year_date", "abbreviation", "kind"], name: "index_readings_on_year_date_and_abbreviation_and_kind"
    t.index ["year_date", "abbreviation"], name: "index_readings_on_year_date_and_abbreviation", unique: true
    t.index ["year_date"], name: "index_readings_on_year_date"
  end

  create_table "resources", force: :cascade do |t|
    t.string "path"
    t.jsonb "props"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "(((props ->> 'height'::text))::integer)", name: "height_index_on_props_resources", where: "((props ->> 'height'::text) IS NOT NULL)"
    t.index "(((props ->> 'width'::text))::integer)", name: "width_index_on_props_resources", where: "((props ->> 'width'::text) IS NOT NULL)"
    t.index "((props ->> 'comment'::text))", name: "comment_index_on_props_resources", where: "((props ->> 'comment'::text) IS NOT NULL)"
    t.index "((props ->> 'event'::text))", name: "event_index_on_props_resources", where: "((props ->> 'event'::text) IS NOT NULL)"
    t.index "((props ->> 'fileinfo'::text))", name: "fileinfo_index_on_props_resources", where: "((props ->> 'fileinfo'::text) IS NOT NULL)"
    t.index "((props ->> 'imageinfo'::text))", name: "imageinfo_index_on_props_resources", where: "((props ->> 'imageinfo'::text) IS NOT NULL)"
    t.index "((props ->> 'kind'::text))", name: "kind_index_on_props_resources", where: "((props ->> 'kind'::text) IS NOT NULL)"
    t.index "((props ->> 'short_name'::text))", name: "short_name_index_on_props_resources", where: "((props ->> 'short_name'::text) IS NOT NULL)"
    t.index "((props ->> 'type'::text))", name: "type_index_on_props_resources", where: "((props ->> 'type'::text) IS NOT NULL)"
    t.index ["path"], name: "index_resources_on_path"
  end

  create_table "scripta", id: :serial, force: :cascade do |t|
    t.text "text"
    t.string "prosomeion_title"
    t.string "language_code", null: false
    t.integer "tone"
    t.string "type"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "title"
    t.string "alphabeth_code", null: false
    t.string "author"
    t.string "description"
    t.string "ref_title"
    t.index ["author"], name: "index_scripta_on_author"
    t.index ["id", "language_code"], name: "index_scripta_on_id_and_language_code"
    t.index ["language_code", "alphabeth_code"], name: "index_scripta_on_language_code_and_alphabeth_code"
    t.index ["prosomeion_title"], name: "index_scripta_on_prosomeion_title"
    t.index ["title", "language_code"], name: "index_scripta_on_title_and_language_code"
    t.index ["title"], name: "index_scripta_on_title", unique: true
    t.index ["tone"], name: "index_scripta_on_tone"
    t.index ["type"], name: "index_scripta_on_type"
  end

  create_table "service_scripta", id: :serial, force: :cascade do |t|
    t.integer "service_id", null: false
    t.integer "scriptum_id", null: false
    t.index ["scriptum_id"], name: "index_service_scripta_on_scriptum_id"
    t.index ["service_id", "scriptum_id"], name: "index_service_scripta_on_service_id_and_scriptum_id", unique: true
    t.index ["service_id"], name: "index_service_scripta_on_service_id"
  end

  create_table "services", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.string "language_code", null: false
    t.integer "info_id", null: false
    t.string "type"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "alphabeth_code", null: false
    t.text "text"
    t.string "text_format"
    t.string "gospel"
    t.string "apostle"
    t.string "author"
    t.string "source"
    t.string "description"
    t.string "info_type", null: false
    t.string "ref_title"
    t.integer "tone"
    t.index ["alphabeth_code"], name: "index_services_on_alphabeth_code"
    t.index ["apostle"], name: "index_services_on_apostle"
    t.index ["author"], name: "index_services_on_author"
    t.index ["description"], name: "index_services_on_description"
    t.index ["gospel"], name: "index_services_on_gospel"
    t.index ["info_id", "info_type", "name", "alphabeth_code"], name: "index_services_on_info_id_info_type_name_alphabeth_code", unique: true
    t.index ["info_id"], name: "index_services_on_info_id"
    t.index ["info_type", "info_id"], name: "index_services_on_info_type_and_info_id"
    t.index ["info_type"], name: "index_services_on_info_type"
    t.index ["language_code"], name: "index_services_on_language_code"
    t.index ["name"], name: "index_services_on_name"
    t.index ["ref_title"], name: "index_services_on_ref_title"
    t.index ["source"], name: "index_services_on_source"
    t.index ["text_format"], name: "index_services_on_text_format"
    t.index ["tone"], name: "index_services_on_tone"
    t.index ["type"], name: "index_services_on_type"
  end

  create_table "slugs", id: :serial, force: :cascade do |t|
    t.string "text", null: false
    t.string "sluggable_type"
    t.integer "sluggable_id"
    t.index ["sluggable_type", "sluggable_id"], name: "index_slugs_on_sluggable_type_and_sluggable_id"
    t.index ["text"], name: "index_slugs_on_text", unique: true
  end

  create_table "subjects", id: :serial, force: :cascade do |t|
    t.string "kind_code", null: false
    t.string "key", null: false
    t.jsonb "meta"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["key"], name: "index_subjects_on_key", unique: true
    t.index ["kind_code", "key", "id"], name: "index_subjects_on_kind_code_and_key_and_id"
    t.index ["kind_code", "key"], name: "index_subjects_on_kind_code_and_key"
    t.index ["kind_code"], name: "index_subjects_on_kind_code"
  end

  create_table "thumbs", force: :cascade do |t|
    t.uuid "uid", null: false
    t.binary "digest", null: false
    t.string "url", null: false
    t.string "thumb", null: false
    t.string "thumbable_type", null: false
    t.bigint "thumbable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["digest"], name: "index_thumbs_on_digest", unique: true
    t.index ["thumbable_type", "thumbable_id"], name: "index_thumbs_on_thumbable"
    t.index ["uid"], name: "index_thumbs_on_uid", unique: true
    t.index ["url"], name: "index_thumbs_on_url", unique: true
  end

  add_foreign_key "coverings", "memories", on_delete: :cascade
  add_foreign_key "coverings", "places", on_delete: :cascade
  add_foreign_key "image_attitudes", "pictures", on_delete: :cascade
  add_foreign_key "links", "resources", on_delete: :cascade
  add_foreign_key "markups", "readings", on_delete: :cascade
  add_foreign_key "markups", "scripta", on_delete: :restrict
  add_foreign_key "memory_binds", "memories", column: "bond_to_id", on_delete: :cascade
  add_foreign_key "memory_binds", "memories", on_delete: :cascade
  add_foreign_key "memory_names", "nomina", on_delete: :cascade
  add_foreign_key "service_scripta", "scripta", on_delete: :cascade
  add_foreign_key "service_scripta", "services", on_delete: :cascade
end
