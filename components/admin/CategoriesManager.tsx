'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/actions/categories'
import type { CategoryWithCount } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  PlusCircle,
  Edit,
  Trash2,
  Tag,
  Search,
  AlertTriangle,
  FolderSync,
} from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

interface CategoriesManagerProps {
  initialCategories: CategoryWithCount[]
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Add Category State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addName, setAddName] = useState('')
  const [addSlug, setAddSlug] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Edit Category State
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Delete Category State
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null)
  const [deleteMoveOption, setDeleteMoveOption] = useState<'move' | 'uncategorize'>('move')
  const [targetCategoryId, setTargetCategoryId] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtered categories
  const filteredCategories = initialCategories.filter((cat) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q)
  })

  // ─── Add Category Handler ───────────────────────────────────
  const handleOpenAdd = () => {
    setAddName('')
    setAddSlug('')
    setIsAddOpen(true)
  }

  const handleAddNameChange = (val: string) => {
    setAddName(val)
    setAddSlug(generateSlug(val))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addName.trim()) {
      toast.error('Category name is required')
      return
    }

    setIsAdding(true)
    const res = await createCategory(addName, addSlug)
    setIsAdding(false)

    if (res.success) {
      toast.success(`Category "${addName.trim()}" created successfully`)
      setIsAddOpen(false)
      setAddName('')
      setAddSlug('')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to create category')
    }
  }

  // ─── Edit Category Handler ──────────────────────────────────
  const handleOpenEdit = (category: CategoryWithCount) => {
    setEditingCategory(category)
    setEditName(category.name)
    setEditSlug(category.slug)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    if (!editName.trim()) {
      toast.error('Category name is required')
      return
    }

    setIsEditing(true)
    const res = await updateCategory(editingCategory.id, editName, editSlug)
    setIsEditing(false)

    if (res.success) {
      toast.success(`Category updated successfully`)
      setEditingCategory(null)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to update category')
    }
  }

  // ─── Delete Category Handler ────────────────────────────────
  const handleOpenDelete = (category: CategoryWithCount) => {
    setDeletingCategory(category)
    const otherCategories = initialCategories.filter((c) => c.id !== category.id)
    if (otherCategories.length > 0) {
      setDeleteMoveOption('move')
      setTargetCategoryId(otherCategories[0].id)
    } else {
      setDeleteMoveOption('uncategorize')
      setTargetCategoryId('')
    }
  }

  const handleDelete = async () => {
    if (!deletingCategory) return

    setIsDeleting(true)
    const moveTo =
      deletingCategory.productCount > 0 && deleteMoveOption === 'move' && targetCategoryId
        ? targetCategoryId
        : null

    const res = await deleteCategory(deletingCategory.id, moveTo)
    setIsDeleting(false)

    if (res.success) {
      toast.success(`Category "${deletingCategory.name}" deleted`)
      setDeletingCategory(null)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete category')
    }
  }

  const otherCategoriesForMove = deletingCategory
    ? initialCategories.filter((c) => c.id !== deletingCategory.id)
    : []

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-4 shadow-[var(--shadow-card)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pheezes-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-pheezes-gray-50 border border-pheezes-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pheezes-yellow focus:border-transparent transition"
          />
        </div>

        {/* Add button */}
        <Button onClick={handleOpenAdd} variant="primary" size="md" className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Table / List */}
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-pheezes-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-7 w-7 text-pheezes-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-pheezes-black mb-1">
              {searchQuery ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-pheezes-gray-400 text-sm max-w-xs mx-auto mb-5">
              {searchQuery
                ? `No categories match "${searchQuery}". Try a different keyword.`
                : 'Create your first product category to organize your catalog.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenAdd} variant="primary" size="sm">
                <PlusCircle className="h-4 w-4" />
                Add Category
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Category Name</TableHead>
                  <TableHead className="w-[30%]">Slug / URL</TableHead>
                  <TableHead className="w-[20%] text-center">Products</TableHead>
                  <TableHead className="w-[20%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-pheezes-gray-50/50 transition-colors">
                    {/* Category Name */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-pheezes-yellow/20 flex items-center justify-center text-pheezes-black font-semibold text-xs flex-shrink-0">
                          {cat.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-pheezes-black block">
                            {cat.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Slug */}
                    <TableCell>
                      <span className="text-xs font-mono text-pheezes-gray-500 bg-pheezes-gray-100 px-2 py-0.5 rounded-md">
                        {cat.slug}
                      </span>
                    </TableCell>

                    {/* Product count */}
                    <TableCell className="text-center">
                      <Link
                        href={`/admin/products?category=${cat.id}`}
                        className="inline-flex items-center gap-1 group hover:underline"
                        title="View products in this category"
                      >
                        <Badge variant={cat.productCount > 0 ? 'yellow' : 'default'}>
                          {cat.productCount} {cat.productCount === 1 ? 'product' : 'products'}
                        </Badge>
                      </Link>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="w-8 h-8 rounded-lg text-pheezes-gray-500 hover:text-pheezes-black hover:bg-pheezes-gray-100 flex items-center justify-center transition-colors"
                          title="Edit category"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(cat)}
                          className="w-8 h-8 rounded-lg text-pheezes-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ─── ADD CATEGORY DIALOG ─────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-pheezes-yellow/20 flex items-center justify-center text-pheezes-black">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogDescription>
                    Create a new product category for your catalog.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="add-name" required>Category Name</Label>
                <Input
                  id="add-name"
                  value={addName}
                  onChange={(e) => handleAddNameChange(e.target.value)}
                  placeholder="e.g. Leather Wallets"
                  autoFocus
                  required
                />
              </div>

              <div>
                <Label htmlFor="add-slug">URL Slug</Label>
                <Input
                  id="add-slug"
                  value={addSlug}
                  onChange={(e) => setAddSlug(e.target.value)}
                  placeholder="e.g. leather-wallets"
                />
                <p className="text-[11px] text-pheezes-gray-400 mt-1">
                  Leave blank or modify to customize the category web address.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsAddOpen(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isAdding}
                disabled={isAdding || !addName.trim()}
              >
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── EDIT CATEGORY DIALOG ────────────────────────────── */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-pheezes-gray-100 flex items-center justify-center text-pheezes-black">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>
                    Update category name or URL slug.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name" required>Category Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Category Name"
                  autoFocus
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-slug">URL Slug</Label>
                <Input
                  id="edit-slug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  placeholder="URL Slug"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setEditingCategory(null)}
                disabled={isEditing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isEditing}
                disabled={isEditing || !editName.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── DELETE CATEGORY DIALOG WITH REASSIGN PROMPT ─────── */}
      <Dialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <DialogContent className="max-w-md" showClose={!isDeleting}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-pheezes-black">
                    &quot;{deletingCategory?.name}&quot;
                  </span>
                  ?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-3 space-y-4">
            {deletingCategory && deletingCategory.productCount > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <FolderSync className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    This category currently has{' '}
                    <span className="font-bold">
                      {deletingCategory.productCount}{' '}
                      {deletingCategory.productCount === 1 ? 'product' : 'products'}
                    </span>
                    . What would you like to do with them before deleting?
                  </div>
                </div>

                {/* Option 1: Move to another category */}
                {otherCategoriesForMove.length > 0 && (
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      deleteMoveOption === 'move'
                        ? 'border-pheezes-yellow bg-pheezes-yellow/5'
                        : 'border-pheezes-gray-200 hover:bg-pheezes-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deleteMoveOption"
                      checked={deleteMoveOption === 'move'}
                      onChange={() => setDeleteMoveOption('move')}
                      className="mt-1 text-pheezes-black focus:ring-pheezes-yellow"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="text-sm font-semibold text-pheezes-black">
                        Move products to another category
                      </div>
                      {deleteMoveOption === 'move' && (
                        <select
                          value={targetCategoryId}
                          onChange={(e) => setTargetCategoryId(e.target.value)}
                          className="w-full h-9 px-3 text-xs bg-white border border-pheezes-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
                        >
                          {otherCategoriesForMove.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.productCount} existing products)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                )}

                {/* Option 2: Leave Uncategorized */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    deleteMoveOption === 'uncategorize' || otherCategoriesForMove.length === 0
                      ? 'border-pheezes-yellow bg-pheezes-yellow/5'
                      : 'border-pheezes-gray-200 hover:bg-pheezes-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="deleteMoveOption"
                    checked={
                      deleteMoveOption === 'uncategorize' || otherCategoriesForMove.length === 0
                    }
                    onChange={() => setDeleteMoveOption('uncategorize')}
                    className="mt-1 text-pheezes-black focus:ring-pheezes-yellow"
                  />
                  <div>
                    <div className="text-sm font-semibold text-pheezes-black">
                      Assign to Uncategorized
                    </div>
                    <p className="text-xs text-pheezes-gray-500 mt-0.5">
                      Products will remain in your catalog but without any category assigned.
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-sm text-pheezes-gray-500">
                There are no products under this category. It will be permanently removed.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setDeletingCategory(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="md"
              loading={isDeleting}
              onClick={handleDelete}
            >
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
