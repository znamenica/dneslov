class ImportMemoDescriptionFromMemories < ActiveRecord::Migration[4.2]
   def change
      Rake::Task["db:import:memo:descriptions"].invoke('рпц', 'ру') ;end;end
