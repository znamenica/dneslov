Rails.application.routes.draw do
   # The priority is based upon order of creation: first created -> highest priority.
   # See how all your routes lay out with "rake routes".

   # auth routes
   get '/auth/github', to: 'auth#github', format: false

   # You can have the root of your site routed with "root"
   root 'memories#index'

   get '/about' => 'about#index'

   scope module: 'admin' do
      get '/dashboard' => 'common#dashboard'

      resources :memories, param: :id, except: :edit
      resources :calendaries, param: :id, except: :edit
      resources :memoes, param: :id, except: :edit
      resources :names, param: :id, except: :edit

      get '/short_calendaries' => 'calendaries#all'
      get '/short_memoes' => 'memoes#all'
      get '/short_events' => 'events#all'
      get '/short_memories' => 'memories#all'
      get '/short_names' => 'names#all'
      get '/short_places' => 'places#all'
      get '/short_items' => 'items#all'
      get '/icons' => 'memories#icons'
   end

   get '/index' => 'memories#index'

   #slug_options[ :constraints ] = { slug: /[ёа-я0-9]{1,6}/ } if Rails.env.production? 
   get '/:slug' => 'memories#show', as: 'slug'
  #
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
