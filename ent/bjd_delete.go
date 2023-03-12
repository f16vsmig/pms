// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"gopms/ent/bjd"
	"gopms/ent/predicate"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// BjdDelete is the builder for deleting a Bjd entity.
type BjdDelete struct {
	config
	hooks    []Hook
	mutation *BjdMutation
}

// Where appends a list predicates to the BjdDelete builder.
func (bd *BjdDelete) Where(ps ...predicate.Bjd) *BjdDelete {
	bd.mutation.Where(ps...)
	return bd
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (bd *BjdDelete) Exec(ctx context.Context) (int, error) {
	return withHooks[int, BjdMutation](ctx, bd.sqlExec, bd.mutation, bd.hooks)
}

// ExecX is like Exec, but panics if an error occurs.
func (bd *BjdDelete) ExecX(ctx context.Context) int {
	n, err := bd.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (bd *BjdDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := sqlgraph.NewDeleteSpec(bjd.Table, sqlgraph.NewFieldSpec(bjd.FieldID, field.TypeInt))
	if ps := bd.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, bd.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	bd.mutation.done = true
	return affected, err
}

// BjdDeleteOne is the builder for deleting a single Bjd entity.
type BjdDeleteOne struct {
	bd *BjdDelete
}

// Where appends a list predicates to the BjdDelete builder.
func (bdo *BjdDeleteOne) Where(ps ...predicate.Bjd) *BjdDeleteOne {
	bdo.bd.mutation.Where(ps...)
	return bdo
}

// Exec executes the deletion query.
func (bdo *BjdDeleteOne) Exec(ctx context.Context) error {
	n, err := bdo.bd.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{bjd.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (bdo *BjdDeleteOne) ExecX(ctx context.Context) {
	if err := bdo.Exec(ctx); err != nil {
		panic(err)
	}
}